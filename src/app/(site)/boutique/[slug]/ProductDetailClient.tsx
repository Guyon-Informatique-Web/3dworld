// Partie interactive de la fiche produit — orchestre variantes, prix dynamique et panier
// Client component : gere l'etat de la variante selectionnee et met a jour le prix

"use client";

import { useState } from "react";
import VariantSelector from "@/components/shop/VariantSelector";
import type { VariantOption } from "@/components/shop/VariantSelector";
import AddToCartButton from "@/components/shop/AddToCartButton";
import type { CartVariant } from "@/components/shop/AddToCartButton";

/** Formateur de prix en euros (format francais) */
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

interface ProductDetailClientProps {
  /** Donnees minimales du produit pour le panier */
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
  /** Le produit a-t-il des variantes ? */
  hasVariants: boolean;
  /** Liste des variantes actives */
  variants: VariantOption[];
}

/**
 * Orchestre la selection de variante, l'affichage du prix dynamique
 * et le bouton d'ajout au panier.
 */
export default function ProductDetailClient({
  product,
  hasVariants,
  variants,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);

  // Calcul du prix affiche (prix variante ou prix de base)
  const displayPrice = selectedVariant?.priceOverride ?? product.price;

  // Construire la variante pour le panier
  const cartVariant: CartVariant | null = selectedVariant
    ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.priceOverride ?? product.price,
      }
    : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Prix dynamique (affiche si variantes, sinon le prix est dans le server component) */}
      {hasVariants && (
        <p className="text-2xl font-bold text-primary">
          {formatPrice(displayPrice)}
        </p>
      )}

      {/* Selecteur de variante */}
      {hasVariants && variants.length > 0 && (
        <VariantSelector
          variants={variants}
          basePrice={product.price}
          onSelect={(variant) => setSelectedVariant(variant)}
        />
      )}

      {/* Separateur visuel */}
      <hr className="border-gray-200" />

      {/* Bouton ajout au panier */}
      <AddToCartButton
        product={product}
        selectedVariant={cartVariant}
        hasVariants={hasVariants}
      />
    </div>
  );
}
