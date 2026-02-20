"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

/** Catégories placeholder pour la grille de réalisations */
const GALLERY_ITEMS = [
  {
    label: "Déco",
    gradient: "from-primary/60 to-primary-light/40",
  },
  {
    label: "Figurine",
    gradient: "from-accent/60 to-accent-light/40",
  },
  {
    label: "Prototype",
    gradient: "from-primary-dark/60 to-primary/40",
  },
  {
    label: "Accessoire",
    gradient: "from-accent-dark/60 to-accent/40",
  },
  {
    label: "Maquette",
    gradient: "from-primary-light/60 to-blue-400/40",
  },
  {
    label: "Bijou",
    gradient: "from-primary/50 to-accent/40",
  },
] as const;

/**
 * Aperçu de la galerie de réalisations avec images placeholder.
 * Grille responsive : 1 col mobile, 2 tablette, 3 desktop.
 */
export default function GalleryPreview() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Nos réalisations"
            subtitle="Un aperçu de nos impressions 3D les plus récentes"
          />
        </AnimatedSection>

        {/* Grille de réalisations */}
        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.label}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
              >
                {/* Fond dégradé placeholder */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-300 group-hover:scale-105`}
                />

                {/* Texte catégorie centré */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/80 transition-opacity group-hover:opacity-0">
                    {item.label}
                  </span>
                </div>

                {/* Overlay au hover avec titre */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-lg font-semibold text-white">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Bouton vers la galerie complète */}
        <AnimatedSection delay={0.3}>
          <div className="mt-10 text-center">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
            >
              Voir toutes nos réalisations
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
