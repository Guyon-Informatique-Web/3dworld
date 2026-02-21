"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Section hero plein écran avec titre, sous-titre et boutons CTA.
 * Arrière-plan avec pattern géométrique subtil et dégradé violet.
 * Animation d'entrée progressive (stagger) via Framer Motion.
 */
export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      {/* Arrière-plan : dégradé violet → transparent */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Pattern géométrique subtil : grille de points */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124, 58, 237, 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Contenu centré */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl font-extrabold leading-tight text-text sm:text-5xl lg:text-6xl"
        >
          Donnez vie à vos idées en{" "}
          <span className="text-primary">3D</span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-text-light sm:text-xl"
        >
          Impression 3D sur mesure et créations originales pour particuliers et
          professionnels
        </motion.p>

        {/* Boutons CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/boutique"
            className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
          >
            Découvrir la boutique
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl"
          >
            Demander un devis
          </Link>
        </motion.div>
      </div>

      {/* Dégradé bas pour transition fluide vers la section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
