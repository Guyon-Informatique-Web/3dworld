// Page Mon compte — historique des commandes de l'utilisateur connecté
// Server Component : charge les commandes depuis Prisma par userId

import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderHistory from "@/components/account/OrderHistory";

// Toujours dynamique : les commandes peuvent changer à tout moment
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Consultez votre historique de commandes et gérez votre compte.",
};

/**
 * Page principale de l'espace client.
 * Charge les commandes de l'utilisateur connecté et affiche l'historique.
 */
export default async function MonComptePage() {
  const user = await requireAuth();

  // Charger les commandes de l'utilisateur, triées par date décroissante
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      trackingNumber: true,
      createdAt: true,
      _count: {
        select: { items: true },
      },
    },
  });

  return <OrderHistory orders={orders} />;
}
