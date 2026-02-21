// Page admin des catégories — charge les données et affiche la liste
// Server Component : les données sont chargées côté serveur via Prisma

import { prisma } from "@/lib/prisma";
import CategoryList from "@/components/admin/categories/CategoryList";

export const metadata = {
  title: "Catégories - Administration",
};

export default async function AdminCategoriesPage() {
  // Charger toutes les catégories avec le nombre de produits liés
  // Triées par ordre puis par nom
  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return <CategoryList categories={categories} />;
}
