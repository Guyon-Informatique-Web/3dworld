// Selecteur de variante produit — boutons pills cliquables
// Affiche uniquement si le produit a des variantes actives
// Met a jour le prix affiche via le callback onSelect

"use client";

import { useState } from "react";

/** Type d'une variante serialisee (prix en number) */
export interface VariantOption {
  id: string;
  name: string;
  priceOverride: number | null;
  stock: number;
}

interface VariantSelectorProps {
  /** Liste des variantes actives du produit */
  variants: VariantOption[];
  /** Prix de base du produit (utilise si la variante n'a pas de priceOverride) */
  basePrice: number;
  /** Callback quand une variante est selectionnee */
  onSelect: (variant: VariantOption) => void;
}

/** Formateur de prix en euros (format francais) */
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

/**
 * Selecteur de variante sous forme de boutons pills.
 * Affiche le nom de la variante et le prix si different du prix de base.
 */
export default function VariantSelector({
  variants,
  basePrice,
  onSelect,
}: VariantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /** Gere la selection d'une variante */
  function handleSelect(variant: VariantOption) {
    setSelectedId(variant.id);
    onSelect(variant);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-text">
        Choisir une variante :
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedId === variant.id;
          const effectivePrice = variant.priceOverride ?? basePrice;
          const showPrice = variant.priceOverride !== null && variant.priceOverride !== basePrice;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant)}
              className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-gray-200 bg-white text-text hover:border-primary-light hover:bg-primary/5"
              }`}
            >
              {variant.name}
              {showPrice && (
                <span className={`ml-1 text-xs ${isSelected ? "text-white/80" : "text-text-light"}`}>
                  ({formatPrice(effectivePrice)})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
