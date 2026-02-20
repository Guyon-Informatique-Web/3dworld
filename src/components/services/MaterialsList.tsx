"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

/** Donnée d'un matériau d'impression */
interface Material {
  name: string;
  description: string;
  properties: string[];
  icon: React.ReactNode;
}

/** Liste des matériaux proposés */
const MATERIALS: Material[] = [
  {
    name: "PLA",
    description:
      "Le plus courant. Écologique, facile à imprimer. Idéal pour la décoration et les prototypes visuels.",
    properties: ["Écologique", "Facile à imprimer", "Grande variété de couleurs"],
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
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "PETG",
    description:
      "Résistant et flexible. Parfait pour les pièces mécaniques et les objets du quotidien.",
    properties: ["Résistant aux chocs", "Flexible", "Contact alimentaire"],
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
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    name: "ABS",
    description:
      "Haute résistance thermique. Utilisé pour les pièces techniques et l'automobile.",
    properties: ["Résistant à la chaleur", "Solide", "Post-traitement facile"],
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
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    name: "TPU",
    description:
      "Matériau souple et flexible. Idéal pour les coques, joints et pièces amortissantes.",
    properties: ["Souple", "Élastique", "Résistant à l'usure"],
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
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    name: "Résine",
    description:
      "Ultra détaillé. Parfait pour les figurines, bijoux et pièces miniatures.",
    properties: ["Ultra précis", "Finition lisse", "Détails fins"],
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
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

/**
 * Grille de cartes présentant les matériaux d'impression disponibles.
 * 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop.
 */
export default function MaterialsList() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Nos matériaux"
            subtitle="Choisissez le matériau adapté à votre projet parmi notre sélection"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIALS.map((material, index) => (
            <AnimatedSection key={material.name} delay={index * 0.1}>
              <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg">
                {/* Icône */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-alt text-primary transition-colors group-hover:bg-primary/10">
                  {material.icon}
                </div>

                {/* Nom du matériau */}
                <h3 className="mb-2 text-xl font-bold text-text">
                  {material.name}
                </h3>

                {/* Tags / propriétés clés */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {material.properties.map((prop) => (
                    <span
                      key={prop}
                      className="rounded-full bg-bg-alt px-3 py-1 text-xs font-medium text-primary-dark"
                    >
                      {prop}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="flex-1 text-sm text-text-light leading-relaxed">
                  {material.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
