// Page d'edition d'un produit existant
// Server Component : charge le produit et les categories puis affiche le formulaire

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Modifier le produit - Administration",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // Charger le produit par son identifiant
  const product = await prisma.product.findUnique({
    where: { id },
  });

  // Rediriger vers 404 si le produit n'existe pas
  if (!product) {
    notFound();
  }

  // Charger les categories actives pour le select du formulaire
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  // Serialiser les donnees pour le composant client
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    categoryId: product.categoryId,
    images: product.images,
    hasVariants: product.hasVariants,
  };

  return <ProductForm product={productData} categories={categories} />;
}
