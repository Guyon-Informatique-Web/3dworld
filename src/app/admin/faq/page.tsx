// Page admin des FAQ — charge les données et affiche la liste
// Server Component : les données sont chargées côté serveur via Prisma

import { prisma } from "@/lib/prisma";
import FaqList from "@/components/admin/faq/FaqList";

export const metadata = {
  title: "FAQ - Administration",
};

export default async function AdminFaqPage() {
  // Charger toutes les FAQ triées par ordre
  const items = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  return <FaqList items={items} />;
}
