// Page Boutique publique — catalogue de produits avec filtrage et tri
// Server Component : charge les produits et catégories depuis Prisma
// Filtrage par catégorie via searchParams (?categorie=figurines)
// Tri par date (récent) ou prix (croissant/décroissant)

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import ShopFilter from "@/components/shop/ShopFilter";
import ShopGrid from "@/components/shop/ShopGrid";
import Pagination from "@/components/shop/Pagination";
import type { ProductCardData } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez notre catalogue d'objets imprimés en 3D : figurines, déco, accessoires, prototypes et créations sur mesure. Livraison en France.",
};

/** Nombre de produits par page */
const PRODUCTS_PER_PAGE = 12;

/** Types de tri autorisés */
type SortOption = "recent" | "price-asc" | "price-desc" | "rating" | "name-asc";

/** Vérifie qu'une valeur est un tri valide */
function isValidSort(value: string | undefined): value is SortOption {
  return (
    value === "recent" ||
    value === "price-asc" ||
    value === "price-desc" ||
    value === "rating" ||
    value === "name-asc"
  );
}

interface BoutiquePageProps {
  searchParams: Promise<{
    categorie?: string;
    tri?: string;
    q?: string;
    page?: string;
    stock?: string;
    pmin?: string;
    pmax?: string;
  }>;
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams;
  const categorySlug = params.categorie ?? null;
  const sort: SortOption = isValidSort(params.tri) ? params.tri : "recent";
  const searchQuery = params.q ?? null;
  const pageParam = params.page ? parseInt(params.page, 10) : 1;
  const currentPage = Math.max(1, pageParam);
  const inStockOnly = params.stock === "1";
  const pmin = params.pmin ? parseFloat(params.pmin) : null;
  const pmax = params.pmax ? parseFloat(params.pmax) : null;

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
    stock?: { gt: number };
    price?: { gte?: number; lte?: number };
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
    }>;
  } = { isActive: true };

  // Filtrer par catégorie si un slug est fourni et valide
  if (categorySlug) {
    const categoryExists = categories.some((c) => c.slug === categorySlug);
    if (categoryExists) {
      whereClause.category = { slug: categorySlug };
    }
  }

  // Filtrer par recherche si une requête est fournie
  if (searchQuery && searchQuery.trim()) {
    whereClause.OR = [
      {
        name: { contains: searchQuery.trim(), mode: "insensitive" },
      },
      {
        description: { contains: searchQuery.trim(), mode: "insensitive" },
      },
    ];
  }

  // Filtrer par stock si demandé
  if (inStockOnly) {
    whereClause.stock = { gt: 0 };
  }

  // Filtrer par prix si des limites sont fournies
  if (pmin !== null || pmax !== null) {
    whereClause.price = {};
    if (pmin !== null) {
      whereClause.price.gte = pmin;
    }
    if (pmax !== null) {
      whereClause.price.lte = pmax;
    }
  }

  // Déterminer l'ordre de tri Prisma
  // Pour "rating", on utilise createdAt comme fallback car la note moyenne est calculée après
  let orderBy: Record<string, string>;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "rating":
    case "recent":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Compter le nombre total de produits pour la pagination
  const totalProducts = await prisma.product.count({ where: whereClause });
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Charger les produits avec categorie, variantes actives et statistiques d'avis
  const rawProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
    include: {
      category: {
        select: { name: true, slug: true },
      },
      variants: {
        where: { isActive: true },
        select: { priceOverride: true, stock: true, isActive: true },
      },
      reviews: {
        where: { isApproved: true },
        select: { rating: true },
      },
    },
  });

  // Sérialiser les Decimal Prisma en number pour les composants client
  let products: ProductCardData[] = rawProducts.map((p) => {
    // Calculer la moyenne des notes et le nombre d'avis approuvés
    const reviewCount = p.reviews.length;
    const averageRating = reviewCount > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

    return {
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
      averageRating,
      reviewCount,
    };
  });

  // Trier par note moyenne si demandé (tri en JS après calcul de la moyenne)
  if (sort === "rating") {
    products.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
  }

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
          searchQuery={searchQuery}
          inStockOnly={inStockOnly}
          pmin={pmin}
          pmax={pmax}
        />

        <ShopGrid products={products} searchQuery={searchQuery} />

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </section>
  );
}
