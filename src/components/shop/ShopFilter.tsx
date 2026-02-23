"use client";

// Barre de filtres pour la boutique : barre de recherche + categories (pills) + tri (select)
// Met a jour les searchParams de l'URL sans rechargement complet

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import SearchBar from "@/components/shop/SearchBar";

/** Type minimal d'une categorie pour le filtre */
interface FilterCategory {
  name: string;
  slug: string;
}

interface ShopFilterProps {
  categories: FilterCategory[];
  activeCategory: string | null;
  activeSort: string;
  searchQuery?: string | null;
  inStockOnly?: boolean;
  pmin?: number | null;
  pmax?: number | null;
}

/** Options de tri disponibles */
const SORT_OPTIONS = [
  { value: "recent", label: "Plus récents" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
  { value: "name-asc", label: "Nom A-Z" },
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
  searchQuery = null,
  inStockOnly = false,
  pmin = null,
  pmax = null,
}: ShopFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /** Met à jour un paramètre de recherche dans l'URL et réinitialise la page */
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Réinitialiser la page à 1 pour tout changement de filtre
      params.delete("page");

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

  /** Gestion du toggle "En stock" */
  const handleStockToggle = useCallback(
    (checked: boolean) => {
      updateParam("stock", checked ? "1" : null);
    },
    [updateParam],
  );

  /** Gestion du filtre de prix */
  const handlePriceFilter = useCallback(() => {
    const minInput = document.getElementById("price-min") as HTMLInputElement;
    const maxInput = document.getElementById("price-max") as HTMLInputElement;

    const newMin = minInput.value ? minInput.value : null;
    const newMax = maxInput.value ? maxInput.value : null;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (newMin) {
      params.set("pmin", newMin);
    } else {
      params.delete("pmin");
    }

    if (newMax) {
      params.set("pmax", newMax);
    } else {
      params.delete("pmax");
    }

    const queryString = params.toString();
    router.push(`/boutique${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [router, searchParams]);

  return (
    <div className="mb-10 flex flex-col gap-4 px-4">
      {/* Barre de recherche */}
      <SearchBar defaultValue={searchQuery ?? ""} />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
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

        {/* Menu de tri et autres filtres */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {/* Menu de tri */}
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

          {/* Toggle "En stock" */}
          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text shadow-sm transition-colors hover:border-primary">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => handleStockToggle(e.target.checked)}
              className="cursor-pointer"
            />
            <span>En stock</span>
          </label>
        </div>
      </div>

      {/* Filtre de prix */}
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="price-min" className="text-sm text-text-light">
          Prix min:
        </label>
        <input
          id="price-min"
          type="number"
          placeholder="0"
          defaultValue={pmin ?? ""}
          min="0"
          className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm text-text shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <label htmlFor="price-max" className="text-sm text-text-light">
          Prix max:
        </label>
        <input
          id="price-max"
          type="number"
          placeholder="∞"
          defaultValue={pmax ?? ""}
          min="0"
          className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm text-text shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <button
          onClick={handlePriceFilter}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Filtrer
        </button>
      </div>
    </div>
  );
}
