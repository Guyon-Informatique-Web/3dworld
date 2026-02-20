"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

/** Donnée d'un équipement à afficher */
interface EquipmentItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/** Liste des équipements présentés */
const EQUIPMENT: EquipmentItem[] = [
  {
    title: "Imprimantes FDM",
    description:
      "Nos imprimantes à dépôt de fil fondu pour les pièces standard et les prototypes.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Icône couches empilées (FDM) */}
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Imprimante Résine",
    description:
      "Impression SLA pour les pièces ultra-détaillées : figurines, bijoux, miniatures.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Icône étoile/précision (résine) */}
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Post-traitement",
    description:
      "Station de nettoyage, ponçage et finition pour des résultats impeccables.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Icône outil/clé (post-traitement) */}
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

/**
 * Section équipement avec grille de 3 cartes.
 * Présente les différents types d'imprimantes et le post-traitement.
 */
export default function EquipmentSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Notre équipement"
            subtitle="Des machines de qualité professionnelle pour des résultats irréprochables"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.1}>
              <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg">
                {/* Icône de l'équipement */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-alt text-primary transition-colors group-hover:bg-primary/10">
                  {item.icon}
                </div>

                {/* Titre */}
                <h3 className="mb-2 text-xl font-bold text-text">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="flex-1 text-sm text-text-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
