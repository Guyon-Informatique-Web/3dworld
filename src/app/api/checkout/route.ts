// POST /api/checkout — cree une session Stripe Checkout
// Verifie les prix en BDD, calcule la livraison, cree la commande PENDING puis la session Stripe
// NE FAIT JAMAIS confiance aux prix envoyes par le client

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createOrder } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
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
        { error: "Donnees manquantes : articles, nom, email et methode de livraison requis." },
        { status: 400 }
      );
    }

    // Verifier que la methode de livraison est valide
    if (body.shippingMethod !== "DELIVERY" && body.shippingMethod !== "PICKUP") {
      return NextResponse.json(
        { error: "Methode de livraison invalide." },
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

    // Recuperer l'utilisateur connecte (optionnel, on accepte les commandes invites)
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
      // Pas de session — commande invitee, on continue
    }

    // Recuperer les produits et variantes depuis la BDD pour verifier les prix
    const productIds = [...new Set(body.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        variants: {
          where: { isActive: true },
          select: { id: true, name: true, priceOverride: true },
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
          { error: `Quantite invalide pour ${product.name}.` },
          { status: 400 }
        );
      }

      // Determiner le prix unitaire (variante ou produit de base)
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
        if (variant.priceOverride !== null) {
          unitPrice = Number(variant.priceOverride);
        }
        itemName = `${product.name} - ${variant.name}`;
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

    // Charger les parametres boutique pour les frais de livraison
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

      // Livraison gratuite si le sous-total depasse le seuil
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

    const totalAmount = subtotal + shippingCost;

    // Creer la commande PENDING en base
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
    });

    // Construire les URLs de retour
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Creer la session Stripe Checkout
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
    console.error("Erreur creation session checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la session de paiement." },
      { status: 500 }
    );
  }
}
