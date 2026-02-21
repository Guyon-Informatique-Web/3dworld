// Historique des commandes — liste les commandes de l'utilisateur
// Affiche numero, date, articles, montant et statut avec lien vers le detail

import Link from "next/link";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import type { OrderStatus } from "@/generated/prisma/client";

/** Type d'une commande avec le compte d'articles (retourne par le composant parent) */
interface OrderSummary {
  id: string;
  status: OrderStatus;
  /** Decimal Prisma — converti en number via Number() */
  totalAmount: { toString(): string };
  createdAt: Date;
  _count: {
    items: number;
  };
}

interface OrderHistoryProps {
  /** Liste des commandes triees par date decroissante */
  orders: OrderSummary[];
}

/** Formate un prix en euros (format francais) */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** Formate une date au format français (jour mois année) */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(date);
}

/**
 * Composant d'historique des commandes.
 * Affiche une liste de commandes ou un message si aucune commande n'existe.
 */
export default function OrderHistory({ orders }: OrderHistoryProps) {
  // Aucune commande
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Icone commande vide */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-gray-300"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>

        <h2 className="mb-2 text-xl font-semibold text-text">
          Aucune commande pour le moment
        </h2>
        <p className="mb-6 text-text-light">
          Découvrez nos produits et passez votre première commande.
        </p>
        <Link
          href="/boutique"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  // Liste des commandes
  return (
    <div className="space-y-3">
      <h2 className="mb-4 text-lg font-bold text-text">
        Historique des commandes
      </h2>

      {orders.map((order) => {
        const itemCount = order._count.items;

        return (
          <Link
            key={order.id}
            href={`/commande/${order.id}`}
            className="group block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Infos principales */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                {/* Numéro de commande */}
                <span className="font-mono text-sm font-semibold text-text">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>

                {/* Date */}
                <span className="text-sm text-text-light">
                  {formatDate(order.createdAt)}
                </span>

                {/* Nombre d'articles */}
                <span className="text-sm text-text-light">
                  {itemCount} article{itemCount > 1 ? "s" : ""}
                </span>
              </div>

              {/* Montant et statut */}
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm font-bold text-text">
                  {formatPrice(Number(order.totalAmount))}
                </span>

                {/* Flèche (visible au hover) */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300 transition-colors group-hover:text-primary"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
