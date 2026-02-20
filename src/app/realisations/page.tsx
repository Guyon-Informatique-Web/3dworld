"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import GalleryFilter from "@/components/gallery/GalleryFilter";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/Lightbox";
import {
  CATEGORIES,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from "@/data/gallery";

/**
 * Page Réalisations : galerie filtrable avec lightbox.
 * Affiche les impressions 3D par catégorie avec navigation au clavier.
 */
export default function RealisationsPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filtrer les éléments selon la catégorie active
  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-24">
      {/* Titre de la section */}
      <SectionTitle
        title="Nos réalisations"
        subtitle="Découvrez nos impressions 3D"
      />

      {/* Filtres par catégorie */}
      <GalleryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Grille de la galerie */}
      <GalleryGrid items={filteredItems} onItemClick={setSelectedItem} />

      {/* Lightbox plein écran */}
      <Lightbox
        item={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onNavigate={setSelectedItem}
      />
    </div>
  );
}
