// Formulaire de création/édition d'un article de blog
// Gère le titre, l'extrait, le contenu, la couverture et le flag de publication

"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/app/admin/blog/actions";

/** Données d'un article existant (mode édition) */
interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
}

interface BlogFormProps {
  /** Article à éditer (absent = mode création) */
  post?: BlogPostData;
}

/** Type de retour des server actions */
interface ActionResult {
  success: boolean;
  error?: string;
}

/** État initial du formulaire */
const INITIAL_STATE: ActionResult = { success: false, error: undefined };

export default function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  // État de la couverture
  const [coverImage, setCoverImage] = useState<string>(post?.coverImage ?? "");
  // État du flag publication
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? false);

  /** Wrapper pour les server actions (création ou édition) */
  async function formAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    // Ajouter la couverture au FormData
    formData.set("coverImage", coverImage);
    // Ajouter le flag publication
    formData.set("isPublished", isPublished ? "true" : "false");

    if (isEditing) {
      return updateBlogPost(post.id, formData);
    }
    return createBlogPost(formData);
  }

  const [state, dispatch, isPending] = useActionState(formAction, INITIAL_STATE);

  // Rediriger vers la liste après un succès
  useEffect(() => {
    if (state.success) {
      router.push("/admin/blog");
    }
  }, [state.success, router]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Titre du formulaire */}
        <h2 className="mb-6 text-xl font-semibold text-text">
          {isEditing ? "Éditer l'article" : "Nouvel article"}
        </h2>

        <form action={dispatch} className="space-y-6">
          {/* Champ titre (obligatoire) */}
          <div>
            <label htmlFor="blog-title" className="mb-1 block text-sm font-medium text-text">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              id="blog-title"
              name="title"
              type="text"
              required
              defaultValue={post?.title ?? ""}
              placeholder="Ex : Guide complet de l'impression 3D..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Champ excerpt (obligatoire) */}
          <div>
            <label htmlFor="blog-excerpt" className="mb-1 block text-sm font-medium text-text">
              Extrait <span className="text-red-500">*</span>
            </label>
            <textarea
              id="blog-excerpt"
              name="excerpt"
              rows={2}
              required
              defaultValue={post?.excerpt ?? ""}
              placeholder="Résumé de l'article affiché sur la liste des articles..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Champ contenu (obligatoire) */}
          <div>
            <label htmlFor="blog-content" className="mb-1 block text-sm font-medium text-text">
              Contenu <span className="text-red-500">*</span>
            </label>
            <textarea
              id="blog-content"
              name="content"
              rows={10}
              required
              defaultValue={post?.content ?? ""}
              placeholder="Contenu complet de l'article..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Champ image de couverture (optionnel) */}
          <div>
            <label htmlFor="blog-cover" className="mb-1 block text-sm font-medium text-text">
              Image de couverture (optionnel)
            </label>
            <input
              id="blog-cover"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            {coverImage && (
              <div className="mt-3 relative h-40 w-full overflow-hidden rounded-lg border border-gray-300">
                <img
                  src={coverImage}
                  alt="Aperçu"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Toggle publication */}
          <div className="flex items-center gap-3">
            <input
              id="blog-published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="blog-published" className="text-sm font-medium text-text">
              Publier cet article
            </label>
          </div>

          {/* Message d'erreur */}
          {state.error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              disabled={isPending}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-text-light transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
