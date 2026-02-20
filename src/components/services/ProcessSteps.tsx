"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

/** Donnée d'une étape du processus */
interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/** Les 4 étapes du processus d'impression sur commande */
const STEPS: Step[] = [
  {
    number: 1,
    title: "Envoyez votre idée ou fichier 3D",
    description:
      "Partagez-nous votre fichier STL, OBJ ou 3MF, ou décrivez simplement votre projet. Nous acceptons tous les formats courants.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Échange et validation du projet",
    description:
      "Nous discutons ensemble des détails : matériau, dimensions, finitions. Vous validez le devis avant toute impression.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Impression et contrôle qualité",
    description:
      "Votre pièce est imprimée avec soin. Chaque impression passe par un contrôle qualité rigoureux avant expédition.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Livraison de votre pièce",
    description:
      "Votre objet est soigneusement emballé et expédié. Vous recevez un suivi de livraison par email.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

/**
 * Timeline verticale illustrant le processus d'impression sur commande.
 * Chaque étape apparaît au scroll avec un délai décalé (staggered).
 */
export default function ProcessSteps() {
  return (
    <section className="bg-bg-alt py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Comment ça marche ?"
            subtitle="De votre idée à l'objet fini, en 4 étapes simples"
          />
        </AnimatedSection>

        {/* Timeline verticale */}
        <div className="relative">
          {/* Ligne verticale reliant les étapes */}
          <div
            className="absolute left-6 top-0 h-full w-0.5 bg-primary/30 sm:left-8"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {STEPS.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 0.15}>
                <div className="relative flex gap-6 sm:gap-8">
                  {/* Cercle numéroté */}
                  <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg sm:h-16 sm:w-16 sm:text-xl">
                    {step.number}
                  </div>

                  {/* Contenu de l'étape */}
                  <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    {/* Icône et titre */}
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-primary">{step.icon}</span>
                      <h3 className="text-lg font-bold text-text sm:text-xl">
                        {step.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-text-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
