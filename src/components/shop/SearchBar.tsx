"use client";

// Barre de recherche pour la boutique : search input avec débounce
// Met à jour le paramètre URL ?q=term avec un délai de 300ms
// Affiche un bouton pour effacer la recherche

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Effet pour mettre à jour l'URL avec le texte de recherche
  useEffect(() => {
    // Annuler le délai précédent si l'utilisateur tape rapidement
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Créer un nouveau délai de 300ms avant de mettre à jour l'URL
    const newTimeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      // Réinitialiser à la page 1 quand la recherche change
      params.delete("page");

      const queryString = params.toString();
      router.push(`/boutique${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    }, 300);

    setTimeoutId(newTimeoutId);

    return () => clearTimeout(newTimeoutId);
  }, [query, router, searchParams]);

  // Gestion du clic sur le bouton "effacer"
  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Icone loupe */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 h-5 w-5 text-text-light"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        {/* Input de recherche */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-text placeholder-text-light transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Bouton effacer (X) */}
        {query && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute right-3 flex items-center justify-center rounded p-1 transition-colors hover:bg-gray-100"
            aria-label="Effacer la recherche"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-text-light"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
