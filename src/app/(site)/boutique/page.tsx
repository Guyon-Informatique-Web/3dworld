// Page Boutique publique — catalogue de produits avec filtrage et tri
// Server Component : charge les produits et catégories depuis Prisma
// Filtrage par catégorie via searchParams (?categorie=figurines)
// Tri par date (récent) ou prix (croissant/décroissant)

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import ShopFilter from "@/components/shop/ShopFilter";
import ShopGrid from "@/components/shop/ShopGrid";
import type { ProductCardData } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez notre catalogue d'objets imprimés en 3D : figurines, déco, accessoires, prototypes et créations sur mesure. Livraison en France.",
};

/** Types de tri autorisés */
type SortOption = "recent" | "price-asc" | "price-desc";

/** Vérifie qu'une valeur est un tri valide */
function isValidSort(value: string | undefined): value is SortOption {
  return value === "recent" || value === "price-asc" || value === "price-desc";
}

interface BoutiquePageProps {
  searchParams: Promise<{
    categorie?: string;
    tri?: string;
  }>;
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams;
  const categorySlug = params.categorie ?? null;
  const sort: SortOption = isValidSort(params.tri) ? params.tri : "recent";

  // Charger les catégories actives pour le filtre
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { name: true, slug: true },
  });

  // Construire la clause where pour les produits
  const whereClause: {
    isActive: boolean;
    category?: { slug: string };
  } = { isActive: true };

  // Filtrer par catégorie si un slug est fourni et valide
  if (categorySlug) {
    const categoryExists = categories.some((c) => c.slug === categorySlug);
    if (categoryExists) {
      whereClause.category = { slug: categorySlug };
    }
  }

  // Déterminer l'ordre de tri Prisma
  let orderBy: Record<string, string>;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "recent":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Charger les produits avec categorie et variantes actives
  const rawProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    include: {
      category: {
        select: { name: true, slug: true },
      },
      variants: {
        where: { isActive: true },
        select: { priceOverride: true, isActive: true },
      },
    },
  });

  // Sérialiser les Decimal Prisma en number pour les composants client
  const products: ProductCardData[] = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    images: p.images,
    hasVariants: p.hasVariants,
    variants: p.variants.map((v) => ({
      priceOverride: v.priceOverride !== null ? Number(v.priceOverride) : null,
      isActive: v.isActive,
    })),
    category: p.category,
  }));

  return (
    <section className="pt-28 pb-12">
      <SectionTitle
        title="Boutique"
        subtitle="Découvrez nos créations imprimées en 3D, prêtes à commander."
      />

      <div className="mx-auto max-w-6xl">
        <ShopFilter
          categories={categories}
          activeCategory={categorySlug}
          activeSort={sort}
        />

        <ShopGrid products={products} />
      </div>
    </section>
  );
}
