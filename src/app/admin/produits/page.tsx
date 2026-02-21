// Page admin des produits — charge les données et affiche la liste
// Server Component : les données sont chargées côté serveur via Prisma

import { prisma } from "@/lib/prisma";
import ProductList from "@/components/admin/products/ProductList";

export const metadata = {
  title: "Produits - Administration",
};

export default async function AdminProductsPage() {
  // Charger tous les produits avec leur catégorie
  // Triés par date de création décroissante (plus récents en premier)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  // Charger les categories actives pour le filtre
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  // Sérialiser les prix Decimal en string pour le composant client
  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price.toString(),
    images: product.images,
    isActive: product.isActive,
    hasVariants: product.hasVariants,
    category: product.category,
  }));

  return <ProductList products={serializedProducts} categories={categories} />;
}
