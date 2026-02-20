"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

/** Donnée d'une statistique à afficher */
interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

/** Les 4 statistiques clés de 3D World */
const STATS: StatItem[] = [
  { value: 500, suffix: "+", label: "Projets réalisés" },
  { value: 200, suffix: "+", label: "Clients satisfaits" },
  { value: 5, suffix: "", label: "Matériaux disponibles" },
  { value: 2023, suffix: "", label: "Année de création" },
];

/** Durée totale de l'animation de comptage en millisecondes */
const ANIMATION_DURATION = 2000;

/**
 * Compteur animé individuel.
 * Anime la valeur de 0 jusqu'à la cible quand le composant entre dans le viewport.
 */
function AnimatedCounter({ value, suffix, label }: StatItem) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    /** Fonction d'animation appelée à chaque frame */
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Easing ease-out pour un effet naturel
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * value);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="text-4xl font-bold text-primary sm:text-5xl">
        {displayValue}
        {suffix}
      </span>
      <span className="mt-2 text-base text-text-light">{label}</span>
    </div>
  );
}

/**
 * Section de statistiques avec compteurs animés.
 * Grille 2x2 mobile, 4 colonnes desktop, fond bg-alt.
 */
export default function StatsSection() {
  return (
    <section className="bg-bg-alt py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
