// Bouton d'ajout au panier — selecteur de quantite + bouton accent
// Utilise le CartContext pour ajouter les articles au panier persistant
// Desactive si des variantes existent mais aucune n'est selectionnee

"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

/** Donnees produit necessaires pour l'ajout au panier */
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

/** Donnees variante necessaires pour l'ajout au panier */
export interface CartVariant {
  id: string;
  name: string;
  price: number;
}

interface AddToCartButtonProps {
  /** Produit a ajouter */
  product: CartProduct;
  /** Variante selectionnee (null si pas de variantes ou non selectionnee) */
  selectedVariant: CartVariant | null;
  /** Le produit a-t-il des variantes ? */
  hasVariants: boolean;
}

/**
 * Bouton d'ajout au panier avec selecteur de quantite.
 * Desactive avec message si des variantes existent mais aucune n'est selectionnee.
 * Affiche un feedback "Ajoute !" pendant 2 secondes apres l'ajout.
 */
export default function AddToCartButton({
  product,
  selectedVariant,
  hasVariants,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const { addItem } = useCart();

  // Desactive si le produit a des variantes mais aucune n'est selectionnee
  const isDisabled = hasVariants && !selectedVariant;

  /** Gere le changement de quantite */
  function handleQuantityChange(newQty: number) {
    // Borner entre 1 et 99
    const clamped = Math.max(1, Math.min(99, newQty));
    setQuantity(clamped);
  }

  /** Gere l'ajout au panier via le CartContext */
  function handleAddToCart() {
    if (isDisabled) return;

    addItem({
      productId: product.id,
      name: product.name,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      price: selectedVariant?.price ?? product.price,
      quantity,
      image: product.image ?? undefined,
    });

    // Afficher le feedback temporaire
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);

    // Reinitialiser la quantite apres ajout
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Selecteur de quantite */}
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm font-medium text-text">
          Quantit&eacute; :
        </label>
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-lg font-medium text-text transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Reduire la quantite"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
            className="h-10 w-14 border-x border-gray-200 text-center text-sm font-medium text-text outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 99}
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-lg font-medium text-text transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Augmenter la quantite"
          >
            +
          </button>
        </div>
      </div>

      {/* Bouton d'ajout au panier */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-full cursor-pointer rounded-xl px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 ${
          isDisabled
            ? "cursor-not-allowed bg-gray-300"
            : showFeedback
              ? "bg-green-500 shadow-lg shadow-green-500/25"
              : "bg-accent shadow-lg shadow-accent/25 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
        }`}
      >
        {isDisabled
          ? "Selectionnez une variante"
          : showFeedback
            ? "Ajoute !"
            : "Ajouter au panier"}
      </button>
    </div>
  );
}
