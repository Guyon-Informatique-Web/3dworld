// Bouton d'ajout au panier — selecteur de quantite + bouton accent
// Pour l'instant, log en console (le CartContext sera ajoute dans Task 9)
// Desactive si des variantes existent mais aucune n'est selectionnee

"use client";

import { useState } from "react";

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
 */
export default function AddToCartButton({
  product,
  selectedVariant,
  hasVariants,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);

  // Desactive si le produit a des variantes mais aucune n'est selectionnee
  const isDisabled = hasVariants && !selectedVariant;

  /** Gere le changement de quantite */
  function handleQuantityChange(newQty: number) {
    // Borner entre 1 et 99
    const clamped = Math.max(1, Math.min(99, newQty));
    setQuantity(clamped);
  }

  /** Gere l'ajout au panier */
  function handleAddToCart() {
    if (isDisabled) return;

    const cartItem = {
      productId: product.id,
      productName: product.name,
      image: product.image,
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      unitPrice: selectedVariant?.price ?? product.price,
      quantity,
    };

    // TODO: Remplacer par CartContext.addItem() dans Task 9
    console.log("[Panier] Ajout :", cartItem);
    alert(
      `${quantity}x "${product.name}"${selectedVariant ? ` (${selectedVariant.name})` : ""} ajout\u00e9(s) au panier !`
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Selecteur de quantite */}
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm font-medium text-text">
          Quantit\u00e9 :
        </label>
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-lg font-medium text-text transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="R\u00e9duire la quantit\u00e9"
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
            aria-label="Augmenter la quantit\u00e9"
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
            : "bg-accent shadow-lg shadow-accent/25 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
        }`}
      >
        {isDisabled ? "S\u00e9lectionnez une variante" : "Ajouter au panier"}
      </button>
    </div>
  );
}
