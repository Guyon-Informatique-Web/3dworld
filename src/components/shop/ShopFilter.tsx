"use client";

// Barre de filtres pour la boutique : categories (pills) + tri (select)
// Met a jour les searchParams de l'URL sans rechargement complet

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** Type minimal d'une categorie pour le filtre */
interface FilterCategory {
  name: string;
  slug: string;
}

interface ShopFilterProps {
  categories: FilterCategory[];
  activeCategory: string | null;
  activeSort: string;
}

/** Options de tri disponibles */
const SORT_OPTIONS = [
  { value: "recent", label: "Plus récents" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
] as const;

/**
 * Barre de filtres horizontale : boutons catégorie (style pills) + menu de tri.
 * Scrollable sur mobile, centrée sur desktop.
 * Inspiration : GalleryFilter existant du site.
 */
export default function ShopFilter({
  categories,
  activeCategory,
  activeSort,
}: ShopFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /** Met à jour un paramètre de recherche dans l'URL */
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const queryString = params.toString();
      router.push(`/boutique${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  /** Gestion du clic sur une catégorie */
  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      updateParam("categorie", slug);
    },
    [updateParam],
  );

  /** Gestion du changement de tri */
  const handleSortChange = useCallback(
    (value: string) => {
      // "recent" est la valeur par défaut, on la supprime de l'URL
      updateParam("tri", value === "recent" ? null : value);
    },
    [updateParam],
  );

  return (
    <div className="mb-10 flex flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
      {/* Filtres par catégorie */}
      <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:pb-0">
        {/* Bouton "Toutes" */}
        <button
          onClick={() => handleCategoryChange(null)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeCategory === null
              ? "bg-primary text-white"
              : "bg-gray-100 text-text-light hover:bg-gray-200"
          }`}
        >
          Toutes
        </button>

        {categories.map((cat) => {
          const isActive = cat.slug === activeCategory;
          return (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-light hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Menu de tri */}
      <div className="shrink-0">
        <select
          value={activeSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
