// Page FAQ publique — affiche les questions/réponses actives
// Server Component : charge les données via Prisma

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import FaqAccordion from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur l'impression 3D, les commandes et la livraison",
};

export default async function FaqPage() {
  // Charger les FAQ actives triées par ordre
  const items = await prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Titre de section */}
      <SectionTitle
        title="Questions fréquentes"
        subtitle="Retrouvez les réponses à vos questions les plus courantes"
      />

      {/* Accordion ou message si vide */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">Aucune question pour le moment.</p>
        </div>
      ) : (
        <FaqAccordion
          items={items.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
          }))}
        />
      )}
    </div>
  );
}
