// Ligne d'article dans le panier — image, nom, variante, prix, quantite, suppression
// Composant client car il interagit avec le CartContext

"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice, type CartItem as CartItemType } from "@/lib/cart";

interface CartItemProps {
  /** Article du panier a afficher */
  item: CartItemType;
}

/**
 * Affiche une ligne d'article dans la page panier.
 * Inclut : image, nom + variante, prix unitaire, selecteur quantite, sous-total, bouton supprimer.
 */
export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  /** Sous-total de cette ligne */
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 border-b border-gray-100 py-4 last:border-b-0">
      {/* Image miniature */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Informations produit */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">{item.name}</h3>
          {item.variantName && (
            <p className="mt-0.5 text-xs text-text-light">{item.variantName}</p>
          )}
          <p className="mt-1 text-sm font-medium text-primary">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantite + sous-total + supprimer */}
        <div className="mt-2 flex items-center justify-between">
          {/* Selecteur quantite compact */}
          <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.productId, item.variantId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-sm font-medium text-text transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Reduire la quantite"
            >
              -
            </button>
            <span className="flex h-8 w-10 items-center justify-center border-x border-gray-200 text-sm font-medium text-text">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.productId, item.variantId, item.quantity + 1)
              }
              disabled={item.quantity >= 99}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-sm font-medium text-text transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Augmenter la quantite"
            >
              +
            </button>
          </div>

          {/* Sous-total de la ligne */}
          <span className="text-sm font-semibold text-text">
            {formatPrice(lineTotal)}
          </span>

          {/* Bouton supprimer */}
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={`Supprimer ${item.name} du panier`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
