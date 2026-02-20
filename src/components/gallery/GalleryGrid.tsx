"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import type { GalleryItem } from "@/data/gallery";
import { CATEGORIES } from "@/data/gallery";

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

/**
 * Gradients alternés pour les placeholders d'images.
 * Utilise les couleurs du thème 3D World.
 */
const GRADIENTS = [
  "from-primary to-primary-light",
  "from-primary-dark to-primary",
  "from-accent to-accent-light",
  "from-primary-light to-accent",
  "from-primary to-accent-dark",
  "from-accent-dark to-primary-dark",
];

/**
 * Icône SVG d'un cube 3D pour les placeholders.
 */
function Cube3DIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 text-white/60"
    >
      {/* Face avant */}
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      {/* Face gauche */}
      <path d="M2 17l10 5 10-5" />
      {/* Face droite */}
      <path d="M2 12l10 5 10-5" />
      {/* Arête verticale */}
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Grille responsive de la galerie avec animation staggered.
 * 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop.
 */
export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          // Trouver le label de la catégorie
          const categoryLabel =
            CATEGORIES.find((c) => c.value === item.category)?.label ?? "";
          // Gradient cyclique pour le placeholder
          const gradient = GRADIENTS[index % GRADIENTS.length];

          return (
            <AnimatedSection
              key={item.id}
              delay={index * 0.08}
              className="group"
            >
              <button
                type="button"
                onClick={() => onItemClick(item)}
                className="relative block w-full cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image placeholder avec gradient et icône cube */}
                <div
                  className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                  <Cube3DIcon />
                </div>

                {/* Overlay au hover : titre + catégorie */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-lg font-bold text-white">
                    {item.title}
                  </span>
                  <span className="mt-1 text-sm text-white/80">
                    {categoryLabel}
                  </span>
                </div>
              </button>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {items.length === 0 && (
        <p className="mt-12 text-center text-text-light">
          Aucune réalisation dans cette catégorie pour le moment.
        </p>
      )}
    </section>
  );
}
