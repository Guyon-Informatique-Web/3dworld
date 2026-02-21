// Galerie d'images produit — image principale + miniatures + lightbox
// Client component : gere l'etat de l'image selectionnee et la lightbox
// Utilise next/image pour l'optimisation

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface ProductImagesProps {
  /** Liste des URLs d'images du produit */
  images: string[];
  /** Nom du produit (alt text) */
  productName: string;
}

/**
 * Icone placeholder SVG quand le produit n'a pas d'images.
 */
function PlaceholderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-16 w-16 text-gray-400"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Lightbox simple pour afficher une image en plein ecran.
 * Navigation clavier : Escape (fermer), fleches gauche/droite.
 */
function ImageLightbox({
  images,
  currentIndex,
  productName,
  onClose,
  onNavigate,
}: {
  images: string[];
  currentIndex: number;
  productName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  /** Naviguer vers l'image precedente */
  const goToPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  /** Naviguer vers l'image suivante */
  const goToNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  // Gestion clavier : Escape, ArrowLeft, ArrowRight
  useEffect(() => {
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
  }, [onClose, goToPrev, goToNext]);

  // Empecher le scroll du body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      {/* Contenu principal */}
      <div
        className="relative flex max-h-[90vh] max-w-4xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
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

        {/* Image plein ecran */}
        <div className="relative h-[80vh] w-[80vw] max-w-4xl">
          <Image
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            sizes="80vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Bouton precedent */}
        {hasPrev && (
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
            aria-label="Image pr\u00e9c\u00e9dente"
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

        {/* Bouton suivant */}
        {hasNext && (
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
            aria-label="Image suivante"
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

        {/* Indicateur de position */}
        {images.length > 1 && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant galerie d'images produit.
 * Image principale cliquable (ouvre la lightbox), miniatures en dessous.
 * Affiche un placeholder si aucune image n'est disponible.
 */
export default function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Pas d'images : afficher un placeholder
  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <PlaceholderIcon />
          <p className="text-sm text-text-light">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Image principale — cliquable pour ouvrir la lightbox */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-gray-100"
        aria-label="Agrandir l'image"
      >
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Image principale`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority
        />

        {/* Icone loupe en overlay */}
        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
      </button>

      {/* Miniatures (affichees uniquement s'il y a plus d'une image) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ${
                index === selectedIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox plein ecran */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={selectedIndex}
          productName={productName}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(index) => setSelectedIndex(index)}
        />
      )}
    </div>
  );
}
