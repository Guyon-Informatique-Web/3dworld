"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/data/gallery";
import { CATEGORIES } from "@/data/gallery";

interface LightboxProps {
  /** Élément actuellement affiché (null = fermé) */
  item: GalleryItem | null;
  /** Liste des éléments filtrés pour la navigation */
  items: GalleryItem[];
  /** Fermer la lightbox */
  onClose: () => void;
  /** Naviguer vers un autre élément */
  onNavigate: (item: GalleryItem) => void;
}

/**
 * Gradients pour le placeholder (même liste que GalleryGrid).
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
 * Icône SVG cube 3D (version grande pour la lightbox).
 */
function Cube3DIconLarge() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-20 w-20 text-white/50"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Lightbox plein écran avec navigation clavier et animations.
 * Gère : Escape (fermer), flèches gauche/droite (naviguer).
 */
export default function Lightbox({
  item,
  items,
  onClose,
  onNavigate,
}: LightboxProps) {
  // Index courant dans la liste filtrée
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  /** Naviguer vers l'élément précédent */
  const goToPrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(items[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, items, onNavigate]);

  /** Naviguer vers l'élément suivant */
  const goToNext = useCallback(() => {
    if (hasNext) {
      onNavigate(items[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, items, onNavigate]);

  // Gestion clavier : Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!item) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose, goToPrev, goToNext]);

  // Empêcher le scroll du body quand la lightbox est ouverte
  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  // Gradient du placeholder
  const gradientIndex = item
    ? items.indexOf(item) % GRADIENTS.length
    : 0;
  const gradient = GRADIENTS[gradientIndex >= 0 ? gradientIndex : 0];

  // Label de la catégorie
  const categoryLabel = item
    ? CATEGORIES.find((c) => c.value === item.category)?.label ?? ""
    : "";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          {/* Contenu principal (stopper la propagation du clic) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer (X) */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="Fermer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Image placeholder */}
            <div
              className={`flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br ${gradient}`}
            >
              <Cube3DIconLarge />
            </div>

            {/* Informations sous l'image */}
            <div className="p-6">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {categoryLabel}
              </div>
              <h3 className="text-xl font-bold text-text">{item.title}</h3>
              <p className="mt-2 text-sm text-text-light leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Boutons de navigation (précédent / suivant) */}
            {hasPrev && (
              <button
                onClick={goToPrev}
                className="absolute left-3 top-1/3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                aria-label="Précédent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            {hasNext && (
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                aria-label="Suivant"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
