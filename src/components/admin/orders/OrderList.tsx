// Liste des commandes admin — table avec filtres par statut et lien vers le détail
// Client component pour gérer l'interactivité des filtres

"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrderStatus } from "@/generated/prisma/client";
import OrderStatusBadge from "./OrderStatusBadge";

/** Donnees d'une commande pour la liste */
interface OrderForList {
  id: string;
  email: string;
  name: string;
  status: OrderStatus;
  totalAmount: string;
  shippingMethod: string;
  createdAt: string;
}

interface OrderListProps {
  /** Liste des commandes chargées côté serveur */
  orders: OrderForList[];
}

/** Options de filtre par statut */
const STATUS_FILTERS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Toutes" },
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payées" },
  { value: "PROCESSING", label: "En préparation" },
  { value: "SHIPPED", label: "Expédiées" },
  { value: "DELIVERED", label: "Livrées" },
  { value: "CANCELLED", label: "Annulées" },
];

/**
 * Formate un montant en euros (format français avec virgule décimale).
 */
function formatPrice(amount: string): string {
  const value = parseFloat(amount);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/**
 * Formate une date ISO en format français lisible.
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function OrderList({ orders }: OrderListProps) {
  // Filtre par statut actif
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Appliquer le filtre
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "ALL") return true;
    return order.status === statusFilter;
  });

  // Gerer l'export CSV
  const handleExportCSV = () => {
    const url = new URL("/api/admin/orders/export", window.location.origin);
    if (statusFilter !== "ALL") {
      url.searchParams.set("status", statusFilter);
    }
    window.open(url.toString(), "_blank");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Commandes</h1>

        {/* Compteur total */}
        <span className="text-sm text-text-light">
          {orders.length} commande{orders.length !== 1 ? "s" : ""} au total
        </span>
      </div>

      {/* Filtres par statut et bouton export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            // Compter les commandes par statut
            const count =
              filter.value === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === filter.value).length;

            return (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white text-text-light border border-gray-200 hover:bg-bg-alt hover:text-text"
                }`}
              >
                {filter.label}
                <span
                  className={`ml-1.5 text-xs ${
                    isActive ? "text-white/80" : "text-text-light"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Bouton export CSV */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
        >
          {/* Icone telechargement */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV
        </button>
      </div>

      {/* Table des commandes */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">
            {orders.length === 0
              ? "Aucune commande pour le moment."
              : "Aucune commande ne correspond au filtre sélectionné."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Client
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-light">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Numéro (8 premiers caractères de l'ID) */}
                    <td className="px-6 py-4 font-mono text-sm font-medium text-text">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-text-light">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Client (nom + email) */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text">
                        {order.name}
                      </div>
                      <div className="text-xs text-text-light">
                        {order.email}
                      </div>
                    </td>

                    {/* Montant */}
                    <td className="px-6 py-4 text-right text-sm font-medium text-text">
                      {formatPrice(order.totalAmount)}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg-alt transition-colors"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
