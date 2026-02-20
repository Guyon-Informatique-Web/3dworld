"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

/** Props du composant ServiceDetail */
interface ServiceDetailProps {
  title: string;
  description: string;
  features: string[];
  imageSide: "left" | "right";
  ctaText: string;
  ctaHref: string;
}

/**
 * Section de détail d'un service avec layout 2 colonnes.
 * Image placeholder d'un côté, contenu texte de l'autre.
 * Réutilisable pour chaque service présenté sur la page.
 */
export default function ServiceDetail({
  title,
  description,
  features,
  imageSide,
  ctaText,
  ctaHref,
}: ServiceDetailProps) {
  /** Placeholder image représentant une impression 3D */
  const imagePlaceholder = (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-bg-alt">
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
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );

  /** Contenu texte avec features et CTA */
  const textContent = (
    <div className="flex flex-col justify-center">
      <h2 className="mb-4 text-3xl font-bold text-text sm:text-4xl">
        {title}
      </h2>

      <p className="mb-6 text-lg text-text-light leading-relaxed">
        {description}
      </p>

      {/* Checklist des fonctionnalités */}
      <ul className="mb-8 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            {/* Icône coche verte */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 flex-shrink-0 text-green-500"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-text-light">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Bouton CTA */}
      <div>
        <Link
          href={ctaHref}
          className="inline-block rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div
            className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
              imageSide === "left" ? "" : "lg:[&>*:first-child]:order-2"
            }`}
          >
            {/* Image placeholder */}
            <div>{imagePlaceholder}</div>

            {/* Contenu texte */}
            <div>{textContent}</div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
