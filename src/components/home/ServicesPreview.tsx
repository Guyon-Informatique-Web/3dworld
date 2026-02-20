"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

/** Données des cartes de services */
const SERVICES = [
  {
    title: "Impression sur commande",
    description:
      "Envoyez-nous votre fichier 3D ou décrivez votre projet. Nous imprimons vos pièces sur mesure avec des matériaux de qualité.",
    linkLabel: "En savoir plus",
    linkHref: "/services",
    icon: (
      /* Icône engrenage / imprimante 3D */
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        aria-hidden="true"
      >
        <path d="M12 2v4" />
        <path d="m16.24 7.76-2.83 2.83" />
        <path d="M22 12h-4" />
        <path d="m16.24 16.24-2.83-2.83" />
        <path d="M12 22v-4" />
        <path d="m7.76 16.24 2.83-2.83" />
        <path d="M2 12h4" />
        <path d="m7.76 7.76 2.83 2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Nos créations",
    description:
      "Découvrez notre catalogue d'objets imprimés en 3D : déco, figurines, accessoires et bien plus encore.",
    linkLabel: "Découvrir",
    linkHref: "/realisations",
    icon: (
      /* Icône étoile / palette */
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
] as const;

/**
 * Aperçu des services sur la page d'accueil.
 * 2 cartes côte à côte (1 col mobile, 2 cols desktop).
 */
export default function ServicesPreview() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Nos services"
            subtitle="Que vous ayez un fichier prêt ou juste une idée, nous vous accompagnons"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 0.15}>
              <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg">
                {/* Icône */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-bg-alt transition-colors group-hover:bg-primary/10">
                  {service.icon}
                </div>

                {/* Titre */}
                <h3 className="mb-3 text-xl font-bold text-text">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-6 flex-1 text-text-light leading-relaxed">
                  {service.description}
                </p>

                {/* Lien */}
                <Link
                  href={service.linkHref}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  {service.linkLabel}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
