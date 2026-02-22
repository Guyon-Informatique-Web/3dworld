// POST /api/checkout — crée une session Stripe Checkout
// Vérifie les prix en BDD, calcule la livraison, crée la commande PENDING puis la session Stripe
// NE FAIT JAMAIS confiance aux prix envoyés par le client

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createOrder } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import { validateCoupon, calculateDiscount } from "@/lib/coupons";
import type { ShippingMethod } from "@/generated/prisma/client";

/** Article envoye par le client */
interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

/** Corps de la requete checkout */
interface CheckoutBody {
  items: CheckoutItem[];
  name: string;
  email: string;
  phone?: string;
  shippingMethod: ShippingMethod;
  shippingAddress?: string;
  couponCode?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;

    // Validation des champs obligatoires
    if (
      !body.items ||
      body.items.length === 0 ||
      !body.name?.trim() ||
      !body.email?.trim() ||
      !body.shippingMethod
    ) {
      return NextResponse.json(
        { error: "Données manquantes : articles, nom, email et méthode de livraison requis." },
        { status: 400 }
      );
    }

    // Vérifier que la méthode de livraison est valide
    if (body.shippingMethod !== "DELIVERY" && body.shippingMethod !== "PICKUP") {
      return NextResponse.json(
        { error: "Méthode de livraison invalide." },
        { status: 400 }
      );
    }

    // Si livraison, l'adresse est obligatoire
    if (body.shippingMethod === "DELIVERY" && !body.shippingAddress?.trim()) {
      return NextResponse.json(
        { error: "Adresse de livraison obligatoire pour une livraison." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté (optionnel, on accepte les commandes invités)
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (supabaseUser) {
        const prismaUser = await prisma.user.findUnique({
          where: { supabaseId: supabaseUser.id },
          select: { id: true },
        });
        if (prismaUser) {
          userId = prismaUser.id;
        }
      }
    } catch {
      // Pas de session — commande invitée, on continue
    }

    // Récupérer les produits et variantes depuis la BDD pour vérifier les prix et le stock
    const productIds = [...new Set(body.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        variants: {
          where: { isActive: true },
          select: { id: true, name: true, priceOverride: true, stock: true },
        },
      },
    });

    // Construire un index rapide des produits
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Verifier chaque article et construire les line_items Stripe + items commande
    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    const orderItems: {
      productId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    let subtotal = 0;

    for (const item of body.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable ou inactif : ${item.productId}` },
          { status: 400 }
        );
      }

      if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json(
          { error: `Quantité invalide pour ${product.name}.` },
          { status: 400 }
        );
      }

      // Déterminer le prix unitaire et vérifier le stock (variante ou produit de base)
      let unitPrice = Number(product.price);
      let itemName = product.name;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `Variante introuvable ou inactive pour ${product.name}.` },
            { status: 400 }
          );
        }
        // Vérifier le stock de la variante
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Stock insuffisant pour ${product.name} - ${variant.name}. Disponible: ${variant.stock}` },
            { status: 400 }
          );
        }
        if (variant.priceOverride !== null) {
          unitPrice = Number(variant.priceOverride);
        }
        itemName = `${product.name} - ${variant.name}`;
      } else {
        // Vérifier le stock du produit
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { error: `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}` },
            { status: 400 }
          );
        }
      }

      subtotal += unitPrice * item.quantity;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: itemName },
          unit_amount: Math.round(unitPrice * 100), // Stripe attend des centimes
        },
        quantity: item.quantity,
      });

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
      });
    }

    // Charger les paramètres boutique pour les frais de livraison
    const settings = await prisma.shopSettings.findUnique({
      where: { id: "default" },
    });

    // Calculer les frais de livraison
    let shippingCost = 0;
    if (body.shippingMethod === "DELIVERY" && settings) {
      const fixedPrice = Number(settings.shippingFixedPrice);
      const threshold = settings.freeShippingThreshold
        ? Number(settings.freeShippingThreshold)
        : null;

      // Livraison gratuite si le sous-total dépasse le seuil
      if (threshold && subtotal >= threshold) {
        shippingCost = 0;
      } else {
        shippingCost = fixedPrice;
      }
    }

    // Ajouter les frais de livraison comme line_item Stripe si > 0
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Valider et appliquer le coupon si fourni
    let discountAmount = 0;
    let couponId: string | undefined;
    if (body.couponCode) {
      const couponValidation = await validateCoupon(body.couponCode, subtotal);
      if (couponValidation.valid && couponValidation.coupon) {
        discountAmount = calculateDiscount(
          couponValidation.coupon.discountType,
          couponValidation.coupon.discountValue,
          subtotal
        );
        couponId = couponValidation.coupon.id;

        // Ajouter la remise comme line item négatif Stripe
        if (discountAmount > 0) {
          lineItems.push({
            price_data: {
              currency: "eur",
              product_data: { name: `Remise - ${couponValidation.coupon.code}` },
              unit_amount: -Math.round(discountAmount * 100),
            },
            quantity: 1,
          });
        }
      }
    }

    const totalAmount = subtotal + shippingCost - discountAmount;

    // Créer la commande PENDING en base
    const order = await createOrder({
      userId,
      email: body.email.trim(),
      name: body.name.trim(),
      phone: body.phone?.trim(),
      shippingMethod: body.shippingMethod,
      shippingCost,
      shippingAddress: body.shippingAddress?.trim(),
      totalAmount,
      items: orderItems,
      couponId,
      discountAmount,
    });

    // Incrémenter le compteur d'utilisation du coupon
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { currentUses: { increment: 1 } },
      });
    }

    // Construire les URLs de retour
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: body.email.trim(),
      metadata: {
        orderId: order.id,
      },
      success_url: `${appUrl}/commande/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/panier/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur création session checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement." },
      { status: 500 }
    );
  }
}
