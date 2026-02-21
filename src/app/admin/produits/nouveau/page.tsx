// Page de creation d'un nouveau produit
// Server Component : charge les categories puis affiche le formulaire

import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Nouveau produit - Administration",
};

export default async function NewProductPage() {
  // Charger les categories actives pour le select du formulaire
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return <ProductForm categories={categories} />;
}
