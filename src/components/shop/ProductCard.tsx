// Carte produit pour la grille de la boutique
// Affiche l'image principale, le nom, le prix, la categorie et un lien vers la fiche

import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/components/shop/WishlistButton";
import StarRating from "./StarRating";

/** Type d'une variante avec uniquement les champs necessaires pour le prix et le stock */
interface ProductVariantInfo {
  priceOverride: number | null;
  stock: number;
  isActive: boolean;
}

/** Type du produit attendu par la carte (prix deja serialises en number) */
export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  hasVariants: boolean;
  variants: ProductVariantInfo[];
  category: {
    name: string;
    slug: string;
  };
  averageRating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: ProductCardData;
}

/** Formateur de prix en euros (format francais) */
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

/**
 * Icone de cube 3D en SVG pour le placeholder sans image.
 */
function PlaceholderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 text-gray-400"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Calcule le prix d'affichage du produit.
 * Si le produit a des variantes actives avec un prix override inférieur,
 * retourne { prefix: "À partir de", price: minPrice }.
 * Sinon retourne le prix de base.
 */
function getDisplayPrice(product: ProductCardData): {
  prefix: string | null;
  price: string;
} {
  if (!product.hasVariants || product.variants.length === 0) {
    return { prefix: null, price: formatPrice(product.price) };
  }

  // Récupérer les prix des variantes actives qui ont un override
  const variantPrices = product.variants
    .filter((v) => v.isActive && v.priceOverride !== null)
    .map((v) => v.priceOverride as number);

  if (variantPrices.length === 0) {
    return { prefix: null, price: formatPrice(product.price) };
  }

  const minVariantPrice = Math.min(...variantPrices);

  // Si une variante est moins chère que le prix de base
  if (minVariantPrice < product.price) {
    return {
      prefix: "\u00C0 partir de",
      price: formatPrice(minVariantPrice),
    };
  }

  return { prefix: null, price: formatPrice(product.price) };
}

/**
 * Vérifie si le produit est en rupture de stock.
 * Rupture = stock produit à 0 ET (pas de variantes OU toutes les variantes ont stock <= 0)
 */
function isOutOfStock(product: ProductCardData): boolean {
  // Si le produit a du stock, pas de rupture
  if (product.stock > 0) {
    return false;
  }

  // Si le produit n'a pas de variantes, c'est une rupture
  if (!product.hasVariants || product.variants.length === 0) {
    return true;
  }

  // Si le produit a des variantes, vérifier si au moins une a du stock
  const hasVariantWithStock = product.variants.some((v) => v.stock > 0);
  return !hasVariantWithStock;
}

/**
 * Carte produit individuelle pour la boutique.
 * Affiche l'image, le nom, le prix (avec prefix si variantes) et la catégorie.
 * Lien vers la fiche produit /boutique/[slug].
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { prefix, price } = getDisplayPrice(product);
  const mainImage = product.images.length > 0 ? product.images[0] : null;
  const outOfStock = isOutOfStock(product);

  return (
    <Link
      href={`/boutique/${product.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ${
        !outOfStock ? "hover:shadow-xl hover:-translate-y-1" : ""
      }`}
    >
      {/* Image principale ou placeholder */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${
              !outOfStock ? "group-hover:scale-105" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <PlaceholderIcon />
          </div>
        )}

        {/* Badge catégorie en overlay */}
        <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {product.category.name}
        </span>

        {/* Bouton favoris en haut à droite */}
        <div className="absolute top-3 right-3">
          <WishlistButton productId={product.id} />
        </div>

        {/* Overlay rupture de stock */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-lg font-bold text-white">Rupture de stock</p>
            </div>
          </div>
        )}
      </div>

      {/* Infos produit */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        <div className="mt-2">
          {prefix && (
            <span className="text-xs text-text-light">{prefix} </span>
          )}
          <span className="text-lg font-bold text-primary">{price}</span>
        </div>

        {/* Avis et note si disponibles */}
        {product.reviewCount && product.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.averageRating || 0} size="sm" />
            <span className="text-xs text-text-light">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Bouton visuel "Voir le produit" */}
        <div className="mt-3 flex items-center justify-center rounded-lg bg-primary/10 py-2 text-sm font-medium text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
          Voir le produit
        </div>
      </div>
    </Link>
  );
}
