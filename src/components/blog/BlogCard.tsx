// Carte d'article de blog pour la grille publique
// Affiche l'image de couverture, le titre, l'extrait et la date

import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  /** Titre de l'article */
  title: string;
  /** Slug de l'article pour le lien */
  slug: string;
  /** Extrait (résumé) de l'article */
  excerpt: string;
  /** Image de couverture (optionnel) */
  coverImage?: string | null;
  /** Date de publication */
  publishedAt: Date;
}

/**
 * Icone de document en SVG pour le placeholder sans image.
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
      className="h-12 w-12 text-gray-400"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

/**
 * Formatte une date en format lisible (français).
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Carte d'article de blog pour la liste publique.
 * Affiche l'image, le titre, l'extrait et la date.
 * Lien vers /blog/[slug].
 */
export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image de couverture ou placeholder */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <PlaceholderIcon />
          </div>
        )}
      </div>

      {/* Infos article */}
      <div className="p-5">
        {/* Titre */}
        <h3 className="text-base font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Extrait */}
        <p className="mt-2 text-sm text-text-light line-clamp-3">
          {excerpt}
        </p>

        {/* Date */}
        <div className="mt-4 flex items-center justify-between">
          <time className="text-xs text-text-light">
            {formatDate(publishedAt)}
          </time>
          <span className="text-xs font-medium text-primary">Lire la suite →</span>
        </div>
      </div>
    </Link>
  );
}
