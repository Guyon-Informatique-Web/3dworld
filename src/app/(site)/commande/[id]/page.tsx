// Page de confirmation de commande — affiche le detail apres paiement
// Server Component : charge la commande par ID depuis Prisma
// Affiche un message different selon le statut (PAID ou PENDING)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/lib/orders";

// Toujours dynamique : le statut peut changer entre PENDING et PAID
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  description: "Detail et confirmation de votre commande.",
};

/** Formateur de prix en euros (format francais) */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** Formateur de date (format francais) */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

/** Labels des methodes de livraison */
const shippingMethodLabels: Record<string, string> = {
  DELIVERY: "Livraison a domicile",
  PICKUP: "Retrait sur place",
};

/** Labels des statuts de commande */
const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente de paiement", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Payée", color: "bg-green-100 text-green-800" },
  PROCESSING: { label: "En préparation", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Livrée", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const isPaid = order.status !== "PENDING";
  const statusInfo = statusLabels[order.status] ?? {
    label: order.status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      {/* En-tete avec statut */}
      <div className="mb-8 text-center">
        {isPaid ? (
          <>
            {/* Icone succes */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-text">
              Commande confirmée !
            </h1>
            <p className="text-text-light">
              Merci pour votre achat. Vous recevrez un email de confirmation.
            </p>
          </>
        ) : (
          <>
            {/* Icone en attente */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-600"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-text">
              Paiement en cours de traitement...
            </h1>
            <p className="text-text-light">
              Votre paiement est en cours de vérification. Cette page se mettra
              à jour automatiquement.
            </p>
          </>
        )}
      </div>

      {/* Details de la commande */}
      <div className="space-y-6">
        {/* Informations générales */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-text">
            Détails de la commande
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-text-light">Numéro de commande</span>
              <p className="font-mono text-sm font-medium text-text">
                {order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <span className="text-sm text-text-light">Date</span>
              <p className="text-sm font-medium text-text">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <span className="text-sm text-text-light">Statut</span>
              <p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </p>
            </div>
            <div>
              <span className="text-sm text-text-light">Mode de livraison</span>
              <p className="text-sm font-medium text-text">
                {shippingMethodLabels[order.shippingMethod] ?? order.shippingMethod}
              </p>
            </div>
          </div>

          {/* Adresse de livraison */}
          {order.shippingMethod === "DELIVERY" && order.shippingAddress && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <span className="text-sm text-text-light">
                Adresse de livraison
              </span>
              <p className="mt-1 text-sm text-text whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>
          )}

          {/* Suivi de colis (si disponible) */}
          {order.trackingNumber && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <span className="text-sm text-text-light">
                Numéro de suivi
              </span>
              <p className="mt-1 font-mono text-sm font-medium text-text">
                {order.trackingNumber}
              </p>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Suivre mon colis
                </a>
              )}
            </div>
          )}
        </div>

        {/* Articles */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-text">Articles</h2>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Image produit */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <svg
                        width="24"
                        height="24"
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

                {/* Nom et details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text truncate">
                    {item.product.name}
                  </p>
                  {item.variant && (
                    <p className="text-xs text-text-light">
                      {item.variant.name}
                    </p>
                  )}
                  <p className="text-xs text-text-light">
                    {formatPrice(Number(item.unitPrice))} x {item.quantity}
                  </p>
                </div>

                {/* Sous-total article */}
                <span className="shrink-0 font-medium text-text">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totaux */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">Sous-total</span>
              <span className="font-medium text-text">
                {formatPrice(
                  Number(order.totalAmount) - Number(order.shippingCost)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">Frais de livraison</span>
              <span className="font-medium text-text">
                {Number(order.shippingCost) > 0
                  ? formatPrice(Number(order.shippingCost))
                  : "Gratuit"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-base font-bold text-text">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(Number(order.totalAmount))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour boutique */}
      <div className="mt-8 text-center">
        <Link
          href="/boutique"
          className="inline-block rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
