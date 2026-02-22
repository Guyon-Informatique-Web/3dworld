// Page d'edition d'un produit existant
// Server Component : charge le produit, les categories et les variantes puis affiche le formulaire

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/products/ProductForm";
import VariantManager from "@/components/admin/products/VariantManager";

export const metadata = {
  title: "Modifier le produit - Administration",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // Charger le produit avec ses variantes
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Rediriger vers 404 si le produit n'existe pas
  if (!product) {
    notFound();
  }

  // Charger les catégories actives pour le select du formulaire
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  // Serialiser les donnees pour le composant client (Decimal -> string)
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    categoryId: product.categoryId,
    images: product.images,
    hasVariants: product.hasVariants,
  };

  // Serialiser les variantes pour le composant client (Decimal -> string, Json -> Record)
  const variantsData = product.variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    priceOverride: variant.priceOverride ? variant.priceOverride.toString() : null,
    stock: variant.stock,
    attributes: (variant.attributes ?? {}) as Record<string, string>,
    isActive: variant.isActive,
  }));

  return (
    <>
      <ProductForm product={productData} categories={categories} />

      {/* Afficher le gestionnaire de variantes uniquement si le produit a des variantes */}
      {product.hasVariants && (
        <VariantManager
          productId={product.id}
          productPrice={product.price.toString()}
          variants={variantsData}
        />
      )}
    </>
  );
}
