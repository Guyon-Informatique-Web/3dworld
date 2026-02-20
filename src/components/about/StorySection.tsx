"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";

/**
 * Section "Notre histoire" avec layout asymétrique 2 colonnes.
 * Image placeholder à gauche, texte narratif à droite.
 */
export default function StorySection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Image placeholder avec gradient et icône */}
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-bg-alt to-accent/10">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/40"
                aria-hidden="true"
              >
                {/* Icône imprimante 3D stylisée (cube en couches) */}
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            {/* Texte narratif */}
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold text-text sm:text-4xl">
                Notre histoire
              </h2>

              <div className="space-y-4 text-lg text-text-light leading-relaxed">
                <p>
                  3D World est née d&apos;une passion pour la fabrication
                  numérique et l&apos;impression 3D. Depuis 2023, nous
                  transformons les idées en objets tangibles grâce aux dernières
                  technologies d&apos;impression additive.
                </p>

                <p>
                  Notre mission : rendre l&apos;impression 3D accessible à tous,
                  que vous soyez un particulier avec une idée créative ou une
                  entreprise avec un besoin technique.
                </p>

                <p>
                  Basés en France, nous mettons un point d&apos;honneur à offrir
                  un service personnalisé, des conseils adaptés et une qualité
                  d&apos;impression irréprochable.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
