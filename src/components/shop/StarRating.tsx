// Composant réutilisable pour afficher les étoiles de notation (1-5)
// Version statique et interactive avec hover et callback

"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

/** Retourne la largeur et hauteur de l'icône en fonction de la taille */
function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-6 h-6";
    case "md":
    default:
      return "w-5 h-5";
  }
}

/**
 * Icone SVG d'une étoile
 */
function StarIcon({ filled, size }: { filled: boolean; size: "sm" | "md" | "lg" }) {
  const sizeClass = getSizeClasses(size);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${sizeClass} transition-colors`}
    >
      <polygon points="12 2 15.09 10.26 24 10.5 18 16.16 20.16 24 12 19.54 3.84 24 6 16.16 0 10.5 8.91 10.26 12 2" />
    </svg>
  );
}

/**
 * Composant StarRating pour afficher et éditer une note de 1 à 5 étoiles.
 * Version statique (affiche la note) ou interactive (permet de cliquer pour changer la note).
 */
export default function StarRating({
  rating,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating || Math.round(rating);

  if (!interactive) {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="text-amber-400">
            <StarIcon filled={i < Math.round(rating)} size={size} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          onMouseEnter={() => setHoverRating(i + 1)}
          onMouseLeave={() => setHoverRating(null)}
          className={`${
            i < displayRating ? "text-amber-400" : "text-gray-300"
          } cursor-pointer transition-colors hover:text-amber-300`}
          aria-label={`Note ${i + 1} sur 5`}
        >
          <StarIcon filled={i < displayRating} size={size} />
        </button>
      ))}
    </div>
  );
}
