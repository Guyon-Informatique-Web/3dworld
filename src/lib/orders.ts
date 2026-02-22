// Helpers commandes — creation, mise a jour et recuperation des commandes
// Fonctions serveur uniquement (appelees depuis les Route Handlers)

import { prisma } from "@/lib/prisma";
import type { OrderStatus, ShippingMethod } from "@/generated/prisma/client";

/** Donnees necessaires pour creer un article de commande */
interface CreateOrderItemData {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
}

/** Donnees necessaires pour creer une commande */
interface CreateOrderData {
  userId?: string;
  email: string;
  name: string;
  phone?: string;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  shippingAddress?: string;
  totalAmount: number;
  items: CreateOrderItemData[];
  couponId?: string;
  discountAmount?: number;
}

/**
 * Cree une commande PENDING en base avec ses articles.
 * Le total et les prix unitaires sont calcules cote serveur (jamais fait confiance au client).
 */
export async function createOrder(data: CreateOrderData) {
  const order = await prisma.order.create({
    data: {
      userId: data.userId ?? null,
      email: data.email,
      name: data.name,
      phone: data.phone ?? null,
      status: "PENDING",
      totalAmount: data.totalAmount,
      shippingMethod: data.shippingMethod,
      shippingCost: data.shippingCost,
      shippingAddress: data.shippingAddress ?? null,
      couponId: data.couponId ?? null,
      discountAmount: data.discountAmount ?? 0,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  return order;
}

/**
 * Met a jour le statut d'une commande et optionnellement le stripeSessionId.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  stripeSessionId?: string
) {
  const data: { status: OrderStatus; stripeSessionId?: string } = { status };

  if (stripeSessionId) {
    data.stripeSessionId = stripeSessionId;
  }

  const order = await prisma.order.update({
    where: { id },
    data,
  });

  return order;
}

/**
 * Recupere une commande par son ID avec ses articles et produits associes.
 * Retourne null si la commande n'existe pas.
 */
export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return order;
}
