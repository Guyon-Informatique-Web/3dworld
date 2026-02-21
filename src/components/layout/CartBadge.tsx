// Badge panier pour le header — icone panier SVG avec compteur orange
// Invisible si le panier est vide (0 articles)
// Lien vers la page /panier

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

/**
 * Badge panier avec icone et compteur d'articles.
 * Le badge orange n'apparait que si le panier contient au moins 1 article.
 */
export default function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center justify-center rounded-lg p-2 text-text-light transition-colors hover:text-primary"
      aria-label={`Panier${totalItems > 0 ? ` (${totalItems} article${totalItems > 1 ? "s" : ""})` : ""}`}
    >
      {/* Icone panier SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* Badge compteur — visible seulement si articles > 0 */}
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
