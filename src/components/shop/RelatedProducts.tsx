// Produits associes — affiche jusqu'a 4 produits de la meme categorie (exclut le produit actuel)
// Server Component : charge les donnees depuis Prisma
// Grid responsive : 2 cols mobile, 4 cols desktop

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "./ProductCard";
import type { ProductCardData } from "./ProductCard";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

/**
 * Melange un tableau en place (Fisher-Yates shuffle).
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Charge les produits connexes de la meme categorie.
 * Retourne null s'il y a moins d'1 produit disponible.
 */
async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
): Promise<ProductCardData[] | null> {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: currentProductId },
    },
    take: 8,
    include: {
      category: {
        select: { name: true, slug: true },
      },
      variants: {
        where: { isActive: true },
        select: {
          priceOverride: true,
          stock: true,
          isActive: true,
        },
      },
    },
  });

  // Pas assez de produits
  if (products.length < 1) {
    return null;
  }

  // Melanger et prendre les 4 premiers
  const shuffled = shuffleArray(products);
  const selected = shuffled.slice(0, 4);

  // Serialiser les Decimal en number
  const serialized: ProductCardData[] = selected.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    stock: p.stock,
    images: p.images,
    hasVariants: p.hasVariants,
    variants: p.variants.map((v) => ({
      priceOverride: v.priceOverride !== null ? Number(v.priceOverride) : null,
      stock: v.stock,
      isActive: v.isActive,
    })),
    category: p.category,
  }));

  return serialized;
}

export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, currentProductId);

  // Ne pas afficher si pas assez de produits
  if (!products) {
    return null;
  }

  return (
    <section className="pt-16 pb-12 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4">
        {/* Titre de section */}
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-text mb-8">
            Vous aimerez aussi
          </h2>
        </AnimatedSection>

        {/* Grille de produits — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <AnimatedSection key={product.id} delay={index * 0.1}>
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
