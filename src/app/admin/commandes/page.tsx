// Page admin des commandes — charge les donnees et affiche la liste
// Server Component : les donnees sont chargees cote serveur via Prisma

import { prisma } from "@/lib/prisma";
import OrderList from "@/components/admin/orders/OrderList";

export const metadata = {
  title: "Commandes - Administration",
};

export default async function AdminOrdersPage() {
  // Charger toutes les commandes triees par date decroissante (plus recentes d'abord)
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      totalAmount: true,
      shippingMethod: true,
      createdAt: true,
    },
  });

  // Serialiser les donnees pour le composant client (Decimal -> string, Date -> string)
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    email: order.email,
    name: order.name,
    status: order.status,
    totalAmount: order.totalAmount.toString(),
    shippingMethod: order.shippingMethod,
    createdAt: order.createdAt.toISOString(),
  }));

  return <OrderList orders={serializedOrders} />;
}
