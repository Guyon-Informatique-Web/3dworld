// Page admin des categories — charge les donnees et affiche la liste
// Server Component : les donnees sont chargees cote serveur via Prisma

import { prisma } from "@/lib/prisma";
import CategoryList from "@/components/admin/categories/CategoryList";

export const metadata = {
  title: "Categories - Administration",
};

export default async function AdminCategoriesPage() {
  // Charger toutes les categories avec le nombre de produits lies
  // Triees par ordre puis par nom
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
