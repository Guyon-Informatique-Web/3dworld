// Detail d'une commande admin — affiche toutes les informations et permet de changer le statut
// Client component pour gerer les actions de changement de statut

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { OrderStatus } from "@/generated/prisma/client";
import { updateOrderStatus } from "@/app/admin/commandes/actions";
import OrderStatusBadge from "./OrderStatusBadge";

/** Article d'une commande avec produit et variante */
interface OrderItemData {
  id: string;
  quantity: number;
  unitPrice: string;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  variant: {
    id: string;
    name: string;
  } | null;
}

/** Donnees completes de la commande */
interface OrderData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: OrderStatus;
  totalAmount: string;
  shippingMethod: string;
  shippingCost: string;
  shippingAddress: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
}

interface OrderDetailProps {
  /** Commande chargee cote serveur */
  order: OrderData;
}

/** Labels des methodes de livraison */
const SHIPPING_LABELS: Record<string, string> = {
  DELIVERY: "Livraison a domicile",
  PICKUP: "Retrait sur place",
};

/**
 * Formate un montant en euros (format francais).
 */
function formatPrice(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/**
 * Formate une date ISO en format francais lisible.
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default function OrderDetail({ order }: OrderDetailProps) {
  // Message d'erreur pour les actions
  const [error, setError] = useState<string | null>(null);
  // Message de succes apres changement de statut
  const [success, setSuccess] = useState<string | null>(null);
  // Chargement en cours (identifiant du statut cible)
  const [loading, setLoading] = useState<OrderStatus | null>(null);

  /**
   * Change le statut de la commande via la server action.
   */
  async function handleStatusChange(newStatus: OrderStatus) {
    setError(null);
    setSuccess(null);
    setLoading(newStatus);

    const result = await updateOrderStatus(order.id, newStatus);

    setLoading(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la mise a jour du statut.");
    } else {
      setSuccess("Statut mis a jour avec succes.");
    }
  }

  // Calculer le sous-total (total - frais de livraison)
  const subtotal = parseFloat(order.totalAmount) - parseFloat(order.shippingCost);
  const shippingCost = parseFloat(order.shippingCost);

  return (
    <div className="space-y-6">
      {/* En-tete avec retour et numero de commande */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/commandes"
            className="flex items-center gap-1 text-sm text-text-light hover:text-text transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour aux commandes
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-text-light">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Messages d'erreur et de succes */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Grille : infos client + livraison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations client */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-light">
            Client
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-text-light">Nom</span>
              <p className="text-sm font-medium text-text">{order.name}</p>
            </div>
            <div>
              <span className="text-xs text-text-light">Email</span>
              <p className="text-sm font-medium text-text">{order.email}</p>
            </div>
            {order.phone && (
              <div>
                <span className="text-xs text-text-light">Telephone</span>
                <p className="text-sm font-medium text-text">{order.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Livraison */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-light">
            Livraison
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-text-light">Mode</span>
              <p className="text-sm font-medium text-text">
                {SHIPPING_LABELS[order.shippingMethod] ?? order.shippingMethod}
              </p>
            </div>
            {order.shippingMethod === "DELIVERY" && order.shippingAddress && (
              <div>
                <span className="text-xs text-text-light">Adresse</span>
                <p className="text-sm font-medium text-text whitespace-pre-line">
                  {order.shippingAddress}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs text-text-light">Cout</span>
              <p className="text-sm font-medium text-text">
                {shippingCost > 0 ? formatPrice(order.shippingCost) : "Gratuit"}
              </p>
            </div>
            <div>
              <span className="text-xs text-text-light">Date de commande</span>
              <p className="text-sm font-medium text-text">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-light">
            Articles ({order.items.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                  Produit
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-light">
                  Quantite
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                  Prix unitaire
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                  Sous-total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const itemSubtotal = parseFloat(item.unitPrice) * item.quantity;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* Produit avec image et variante */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Image miniature */}
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-text">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-text-light">
                              {item.variant.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Quantite */}
                    <td className="px-6 py-4 text-center text-sm text-text">
                      {item.quantity}
                    </td>

                    {/* Prix unitaire */}
                    <td className="px-6 py-4 text-right text-sm text-text">
                      {formatPrice(item.unitPrice)}
                    </td>

                    {/* Sous-total article */}
                    <td className="px-6 py-4 text-right text-sm font-medium text-text">
                      {formatPrice(itemSubtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="ml-auto max-w-xs space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">Sous-total</span>
              <span className="font-medium text-text">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">Frais de livraison</span>
              <span className="font-medium text-text">
                {shippingCost > 0 ? formatPrice(order.shippingCost) : "Gratuit"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-base font-bold text-text">Total</span>
              <span className="text-base font-bold text-primary">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions de changement de statut */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-light">
          Actions
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* PAID -> PROCESSING */}
          {order.status === "PAID" && (
            <button
              onClick={() => handleStatusChange("PROCESSING")}
              disabled={loading !== null}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "PROCESSING" ? "Mise a jour..." : "Passer en preparation"}
            </button>
          )}

          {/* PROCESSING -> SHIPPED */}
          {order.status === "PROCESSING" && (
            <button
              onClick={() => handleStatusChange("SHIPPED")}
              disabled={loading !== null}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "SHIPPED" ? "Mise a jour..." : "Marquer comme expediee"}
            </button>
          )}

          {/* SHIPPED -> DELIVERED */}
          {order.status === "SHIPPED" && (
            <button
              onClick={() => handleStatusChange("DELIVERED")}
              disabled={loading !== null}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "DELIVERED" ? "Mise a jour..." : "Marquer comme livree"}
            </button>
          )}

          {/* Annuler (disponible pour tout sauf DELIVERED et CANCELLED) */}
          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <button
              onClick={() => {
                const confirmed = window.confirm(
                  "Annuler cette commande ? Cette action est irreversible."
                );
                if (confirmed) {
                  handleStatusChange("CANCELLED");
                }
              }}
              disabled={loading !== null}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "CANCELLED" ? "Annulation..." : "Annuler la commande"}
            </button>
          )}

          {/* Message si aucune action disponible */}
          {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
            <p className="text-sm text-text-light">
              {order.status === "DELIVERED"
                ? "Cette commande est livree. Aucune action disponible."
                : "Cette commande est annulee. Aucune action disponible."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
