"use client";

// Grille responsive de cartes produits avec animation staggered (Framer Motion)
// 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop

import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductCardData } from "@/components/shop/ProductCard";

interface ShopGridProps {
  products: ProductCardData[];
}

/**
 * Grille de produits pour la boutique publique.
 * Chaque carte apparait avec une animation fade-in staggeree.
 * Affiche un message si aucun produit ne correspond aux filtres.
 */
export default function ShopGrid({ products }: ShopGridProps) {
  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-center justify-center py-20">
          {/* Icone panier vide */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 h-16 w-16 text-gray-300"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p className="text-lg font-medium text-text-light">
            Aucun produit dans cette catégorie pour le moment.
          </p>
          <p className="mt-1 text-sm text-text-light">
            Essayez une autre catégorie ou revenez plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <AnimatedSection
            key={product.id}
            delay={index * 0.08}
            className="group"
          >
            <ProductCard product={product} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
