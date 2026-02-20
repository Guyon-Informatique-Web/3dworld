"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

/**
 * Bandeau d'appel à l'action avec dégradé violet vers bleu.
 * Invite l'utilisateur à demander un devis gratuit.
 */
export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-600 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <AnimatedSection>
          {/* Titre */}
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Vous avez un projet ? Parlons-en !
          </h2>

          {/* Sous-texte */}
          <p className="mt-4 text-lg text-white/80">
            Devis gratuit et sans engagement
          </p>

          {/* Bouton CTA */}
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
