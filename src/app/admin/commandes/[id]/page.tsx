// Page detail d'une commande admin — affiche les infos completes et les actions
// Server Component : charge la commande par ID avec les articles et produits

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderDetail from "@/components/admin/orders/OrderDetail";

export const metadata = {
  title: "Detail commande - Administration",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  // Charger la commande avec les articles, produits et variantes
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
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

  // 404 si la commande n'existe pas
  if (!order) {
    notFound();
  }

  // Serialiser les donnees pour le composant client (Decimal -> string, Date -> string)
  const serializedOrder = {
    id: order.id,
    email: order.email,
    name: order.name,
    phone: order.phone,
    status: order.status,
    totalAmount: order.totalAmount.toString(),
    shippingMethod: order.shippingMethod,
    shippingCost: order.shippingCost.toString(),
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      product: {
        id: item.product.id,
        name: item.product.name,
        images: item.product.images,
      },
      variant: item.variant
        ? { id: item.variant.id, name: item.variant.name }
        : null,
    })),
  };

  return <OrderDetail order={serializedOrder} />;
}
