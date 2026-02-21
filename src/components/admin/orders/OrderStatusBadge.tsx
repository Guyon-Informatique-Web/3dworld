// Badge de statut de commande — affiche un badge colore selon le statut
// Composant reutilisable dans la liste et le detail des commandes

import type { OrderStatus } from "@/generated/prisma/client";

/** Configuration de chaque statut : label francais et classes CSS */
const STATUS_CONFIG: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "En attente",
    classes: "bg-amber-100 text-amber-800",
  },
  PAID: {
    label: "Payee",
    classes: "bg-blue-100 text-blue-800",
  },
  PROCESSING: {
    label: "En preparation",
    classes: "bg-orange-100 text-orange-800",
  },
  SHIPPED: {
    label: "Expediee",
    classes: "bg-indigo-100 text-indigo-800",
  },
  DELIVERED: {
    label: "Livree",
    classes: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Annulee",
    classes: "bg-red-100 text-red-800",
  },
};

interface OrderStatusBadgeProps {
  /** Statut de la commande */
  status: OrderStatus;
}

/**
 * Affiche le statut d'une commande sous forme de badge colore.
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
