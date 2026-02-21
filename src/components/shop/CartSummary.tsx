// Résumé du panier — sous-total, livraison, total, boutons d'action
// Composant client car il lit le CartContext

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/cart";

/**
 * Bloc résumé du panier avec sous-total, info livraison et boutons.
 * Affiche dans la sidebar de la page panier.
 */
export default function CartSummary() {
  const { subtotal, totalItems } = useCart();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-text">
        Récapitulatif
      </h2>

      {/* Lignes de detail */}
      <div className="space-y-3 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-light">
            Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})
          </span>
          <span className="font-medium text-text">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-light">Frais de livraison</span>
          <span className="text-xs italic text-text-light">
            Calculés à l&apos;étape suivante
          </span>
        </div>
      </div>

      {/* Total estime */}
      <div className="flex items-center justify-between py-4">
        <span className="text-base font-bold text-text">Total estime</span>
        <span className="text-lg font-bold text-primary">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Bouton Commander */}
      <Link
        href="/panier/checkout"
        className="block w-full rounded-xl bg-accent px-6 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
      >
        Commander
      </Link>

      {/* Lien continuer les achats */}
      <Link
        href="/boutique"
        className="mt-3 block text-center text-sm font-medium text-primary transition-colors hover:text-primary-dark"
      >
        Continuer vos achats
      </Link>
    </div>
  );
}
