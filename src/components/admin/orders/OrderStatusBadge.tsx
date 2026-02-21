// Badge de statut de commande — affiche un badge coloré selon le statut
// Composant réutilisable dans la liste et le détail des commandes

import type { OrderStatus } from "@/generated/prisma/client";

/** Configuration de chaque statut : label français et classes CSS */
const STATUS_CONFIG: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "En attente",
    classes: "bg-amber-100 text-amber-800",
  },
  PAID: {
    label: "Payée",
    classes: "bg-blue-100 text-blue-800",
  },
  PROCESSING: {
    label: "En préparation",
    classes: "bg-orange-100 text-orange-800",
  },
  SHIPPED: {
    label: "Expédiée",
    classes: "bg-indigo-100 text-indigo-800",
  },
  DELIVERED: {
    label: "Livrée",
    classes: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Annulée",
    classes: "bg-red-100 text-red-800",
  },
};

interface OrderStatusBadgeProps {
  /** Statut de la commande */
  status: OrderStatus;
}

/**
 * Affiche le statut d'une commande sous forme de badge coloré.
 * Chaque statut a une couleur distincte pour faciliter la lecture rapide.
 */
export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
