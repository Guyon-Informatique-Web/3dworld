"use client";

import { useState, useCallback } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

/** Données des témoignages clients */
const TESTIMONIALS = [
  {
    quote:
      "Impression de qualité exceptionnelle pour notre prototype. Délais respectés et communication parfaite.",
    name: "Marc D.",
    role: "Ingénieur",
  },
  {
    quote:
      "Les figurines sont magnifiques, le niveau de détail est incroyable. Je recommande les yeux fermés !",
    name: "Sophie L.",
    role: "Collectionneuse",
  },
  {
    quote:
      "Super réactifs et de bons conseils pour le choix du matériau. Le résultat dépasse mes attentes.",
    name: "Thomas R.",
    role: "Designer",
  },
] as const;

/**
 * Section témoignages avec carrousel navigable.
 * Affiche un témoignage à la fois avec flèches et indicateurs.
 */
export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  /** Aller au témoignage précédent */
  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
  }, []);

  /** Aller au témoignage suivant */
  const goToNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  }, []);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section className="bg-bg-alt py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Ce que disent nos clients"
            subtitle="Ils nous ont fait confiance et partagent leur expérience"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="relative mx-auto max-w-3xl">
            {/* Carte du témoignage actif */}
            <div className="rounded-2xl bg-white px-8 py-10 shadow-sm sm:px-12">
              {/* Guillemets décoratifs */}
              <div className="mb-4 text-5xl font-serif leading-none text-primary/30">
                &ldquo;
              </div>

              {/* Citation */}
              <blockquote className="mb-8 text-lg leading-relaxed text-text sm:text-xl">
                {current.quote}
              </blockquote>

              {/* Auteur */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {current.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text">{current.name}</p>
                  <p className="text-sm text-text-light">{current.role}</p>
                </div>
              </div>
            </div>

            {/* Flèches de navigation */}
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-primary hover:text-white sm:-translate-x-6"
              aria-label="Témoignage précédent"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-primary hover:text-white sm:translate-x-6"
              aria-label="Témoignage suivant"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Indicateurs (points) */}
            <div className="mt-8 flex items-center justify-center gap-3">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === activeIndex
                      ? "bg-primary scale-110"
                      : "bg-primary/25 hover:bg-primary/50"
                  }`}
                  aria-label={`Voir le témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
