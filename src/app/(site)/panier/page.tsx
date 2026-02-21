// Page panier — affiche les articles du panier avec résumé et actions
// Client component car elle utilise le CartContext

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItemComponent from "@/components/shop/CartItem";
import CartSummary from "@/components/shop/CartSummary";

/**
 * Page panier publique.
 * Affiche la liste des articles ou un message si le panier est vide.
 */
export default function PanierPage() {
  const { items, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Titre */}
      <h1 className="mb-8 text-3xl font-bold text-text">Votre panier</h1>

      {items.length === 0 ? (
        // Panier vide
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {/* Icône panier vide */}
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>

          <h2 className="mb-2 text-xl font-semibold text-text">
            Votre panier est vide
          </h2>
          <p className="mb-6 text-text-light">
            Découvrez nos produits et ajoutez vos articles préférés.
          </p>
          <Link
            href="/boutique"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
          >
            Voir la boutique
          </Link>
        </div>
      ) : (
        // Panier avec articles
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Liste des articles (2/3 de la largeur) */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              {/* En-tête avec nombre d'articles et bouton vider */}
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm font-medium text-text-light">
                  {items.length} article{items.length > 1 ? "s" : ""} dans votre
                  panier
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="cursor-pointer text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                >
                  Vider le panier
                </button>
              </div>

              {/* Liste des CartItem */}
              <div>
                {items.map((item) => (
                  <CartItemComponent
                    key={`${item.productId}-${item.variantId ?? "default"}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Résumé / sidebar (1/3 de la largeur) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
