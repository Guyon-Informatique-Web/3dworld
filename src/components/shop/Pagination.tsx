"use client";

// Pagination pour la boutique : boutons de pages avec prev/next
// Affiche les pages avec ellipse si besoin (première, dernière, et 2 autour de la courante)

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * Génère les numéros de pages à afficher
 * Affiche : première page, dernière page, et 2 pages autour de la courante
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const pages: (number | string)[] = [];
  const showAround = 2; // Nombre de pages à afficher avant/après la courante

  // Ajouter la première page
  pages.push(1);

  // Calculer la plage autour de la page courante
  const rangeStart = Math.max(2, currentPage - showAround);
  const rangeEnd = Math.min(totalPages - 1, currentPage + showAround);

  // Ajouter ellipse après la page 1 si nécessaire
  if (rangeStart > 2) {
    pages.push("...");
  }

  // Ajouter les pages de la plage
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Ajouter ellipse avant la dernière page si nécessaire
  if (rangeEnd < totalPages - 1) {
    pages.push("...");
  }

  // Ajouter la dernière page si elle n'est pas déjà présente
  if (totalPages > 1 && rangeEnd < totalPages) {
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Si une seule page, ne rien afficher
  if (totalPages <= 1) {
    return null;
  }

  // Gestion du clic sur un numéro de page
  const handlePageClick = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      const queryString = params.toString();
      router.push(`/boutique${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-center gap-2">
        {/* Bouton Précédent */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "border border-gray-200 hover:border-primary"
          }`}
          aria-label="Page précédente"
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Numéros de pages */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-text-light"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page as number)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-gray-200 text-text hover:border-primary"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
            currentPage === totalPages
              ? "cursor-not-allowed opacity-50"
              : "border border-gray-200 hover:border-primary"
          }`}
          aria-label="Page suivante"
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
