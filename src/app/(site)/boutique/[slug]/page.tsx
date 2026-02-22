// Page fiche produit — affiche le detail d'un produit avec galerie, variantes et ajout panier
// Server Component : charge le produit par slug depuis Prisma
// Layout : galerie a gauche (~60%), infos a droite (~40%), stack vertical sur mobile

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductImages from "@/components/shop/ProductImages";
import ProductDetailClient from "./ProductDetailClient";
import WishlistButton from "@/components/shop/WishlistButton";
import ReviewList from "@/components/shop/ReviewList";
import ReviewForm from "@/components/shop/ReviewForm";
import RelatedProducts from "@/components/shop/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Formateur de prix en euros (format francais) */
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

/**
 * Charge le produit actif par slug avec sa categorie et ses variantes actives.
 * Retourne null si le produit n'existe pas ou est inactif.
 */
async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          priceOverride: true,
          stock: true,
          isActive: true,
        },
      },
    },
  });

  // Produit inexistant ou inactif
  if (!product || !product.isActive) return null;

  // Serialiser les Decimal Prisma en number pour les composants client
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    images: product.images,
    hasVariants: product.hasVariants,
    categoryId: product.categoryId,
    category: product.category,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      priceOverride: v.priceOverride !== null ? Number(v.priceOverride) : null,
      stock: v.stock,
      isActive: v.isActive,
    })),
  };
}

/** Metadonnees dynamiques basees sur le produit */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Produit introuvable",
    };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | 3D World`,
      description: product.description.slice(0, 160),
      images: product.images.length > 0 ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Variantes actives pour le selecteur
  const activeVariants = product.hasVariants
    ? product.variants.filter((v) => v.isActive)
    : [];

  return (
    <section className="pt-28 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Fil d'Ariane */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-light">
          <Link
            href="/boutique"
            className="transition-colors hover:text-primary"
          >
            Boutique
          </Link>
          <span>/</span>
          <Link
            href={`/boutique?categorie=${product.category.slug}`}
            className="transition-colors hover:text-primary"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-text font-medium">{product.name}</span>
        </nav>

        {/* Layout principal : galerie + infos */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Galerie d'images (~60%) */}
          <div className="md:col-span-3">
            <ProductImages
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Informations produit (~40%) */}
          <div className="flex flex-col gap-5 md:col-span-2">
            {/* Badge categorie */}
            <Link
              href={`/boutique?categorie=${product.category.slug}`}
              className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {product.category.name}
            </Link>

            {/* Nom du produit + Bouton favoris */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-text lg:text-3xl">
                {product.name}
              </h1>
              <WishlistButton productId={product.id} />
            </div>

            {/* Prix de base (affiche a cote si pas de variantes) */}
            {!product.hasVariants && (
              <p className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            )}

            {/* Description */}
            <div className="prose prose-sm max-w-none text-text-light leading-relaxed">
              {product.description.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Partie interactive : variantes, prix dynamique, panier */}
            <ProductDetailClient
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                image: product.images.length > 0 ? product.images[0] : null,
              }}
              hasVariants={product.hasVariants}
              variants={activeVariants}
            />
          </div>
        </div>

        {/* Avis clients */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <h2 className="mb-8 text-2xl font-bold text-text">Avis clients</h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Avis existants */}
            <div className="md:col-span-2">
              <ReviewList productId={product.id} />
            </div>

            {/* Formulaire ajout avis */}
            <div>
              <h3 className="mb-4 font-semibold text-text">
                Laisser un avis
              </h3>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Produits associes */}
      <RelatedProducts
        categoryId={product.categoryId}
        currentProductId={product.id}
      />
    </section>
  );
}
