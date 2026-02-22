// Liste des articles de blog admin — table avec titre, statut et actions
// Client component pour gérer l'interactivité (confirmation suppression, toggle publication)

"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteBlogPost, togglePublished } from "@/app/admin/blog/actions";

/** Données d'un article avec dates sérialisées */
interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  /** Liste des articles chargés côté serveur */
  posts: BlogPostData[];
}

export default function BlogList({ posts }: BlogListProps) {
  // Message d'erreur global
  const [error, setError] = useState<string | null>(null);
  // Identifiant de l'article en cours de suppression
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Identifiant de l'article en cours de toggle
  const [togglingId, setTogglingId] = useState<string | null>(null);

  /** Formatte une date ISO en string lisible (format français) */
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  /** Supprimer un article avec confirmation */
  async function handleDelete(post: BlogPostData) {
    const confirmed = window.confirm(
      `Supprimer l'article "${post.title}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(post.id);

    const result = await deleteBlogPost(post.id);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la suppression.");
    }
  }

  /** Basculer la publication d'un article */
  async function handleToggle(post: BlogPostData) {
    setError(null);
    setTogglingId(post.id);

    const result = await togglePublished(post.id);

    setTogglingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la modification du statut.");
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et bouton création */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Articles de blog</h1>
        <Link
          href="/admin/blog/nouveau"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Nouvel article
        </Link>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table des articles */}
      {posts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">
            Aucun article pour le moment.
          </p>
          <p className="mt-1 text-sm text-text-light">
            Cliquez sur &quot;Nouvel article&quot; pour en créer un.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    {/* Titre */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text line-clamp-2">
                        {post.title}
                      </div>
                      <div className="mt-0.5 text-xs text-text-light">
                        {post.slug}
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Brouillon
                        </span>
                      )}
                    </td>

                    {/* Date de création */}
                    <td className="px-6 py-4 text-sm text-text-light">
                      {formatDate(post.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Modifier */}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg-alt transition-colors"
                        >
                          Modifier
                        </Link>

                        {/* Publier/Dépublier */}
                        <button
                          onClick={() => handleToggle(post)}
                          disabled={togglingId === post.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {togglingId === post.id
                            ? "..."
                            : post.isPublished
                              ? "Dépublier"
                              : "Publier"}
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={deletingId === post.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === post.id ? "Suppression..." : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
