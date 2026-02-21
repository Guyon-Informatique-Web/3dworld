// Page Mon compte — historique des commandes de l'utilisateur connecte
// Server Component : charge les commandes depuis Prisma par userId

import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderHistory from "@/components/account/OrderHistory";

// Toujours dynamique : les commandes peuvent changer a tout moment
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Consultez votre historique de commandes et gerez votre compte.",
};

/**
 * Page principale de l'espace client.
 * Charge les commandes de l'utilisateur connecte et affiche l'historique.
 */
export default async function MonComptePage() {
  const user = await requireAuth();

  // Charger les commandes de l'utilisateur, triees par date decroissante
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      _count: {
        select: { items: true },
      },
    },
  });

  return <OrderHistory orders={orders} />;
}
