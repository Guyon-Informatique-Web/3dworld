"use client";

import type { GalleryCategory } from "@/data/gallery";

interface GalleryFilterProps {
  categories: { value: GalleryCategory; label: string }[];
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
}

/**
 * Barre de filtres horizontale par catégorie.
 * Scrollable sur mobile, centrée sur desktop.
 */
export default function GalleryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: GalleryFilterProps) {
  return (
    <div className="mb-10 flex justify-center px-4">
      <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center">
        {categories.map((cat) => {
          const isActive = cat.value === activeCategory;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-light hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
