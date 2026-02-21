// Formulaire de création/édition d'une catégorie
// Génère un aperçu du slug en temps réel à partir du nom

"use client";

import { useActionState, useState, useEffect } from "react";
import { createCategory, updateCategory } from "@/app/admin/categories/actions";

/** Données d'une catégorie existante (mode édition) */
interface CategoryData {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

interface CategoryFormProps {
  /** Catégorie à éditer (absent = mode création) */
  category?: CategoryData;
  /** Callback après enregistrement ou annulation */
  onClose: () => void;
}

/** Type de retour des server actions */
interface ActionResult {
  success: boolean;
  error?: string;
}

/** État initial du formulaire */
const INITIAL_STATE: ActionResult = { success: false, error: undefined };

/**
 * Génère un aperçu de slug côté client (même logique que le serveur).
 */
function previewSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const isEditing = !!category;

  // État du nom pour l'aperçu du slug
  const [name, setName] = useState(category?.name ?? "");

  // Server action wrapper pour le mode création/édition
  async function formAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    if (isEditing) {
      return updateCategory(category.id, formData);
    }
    return createCategory(formData);
  }

  const [state, dispatch, isPending] = useActionState(formAction, INITIAL_STATE);

  // Fermer le formulaire après un succès
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  const slug = previewSlug(name);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Titre du formulaire */}
      <h2 className="mb-4 text-lg font-semibold text-text">
        {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
      </h2>

      <form action={dispatch} className="space-y-4">
        {/* Champ nom (obligatoire) */}
        <div>
          <label htmlFor="category-name" className="mb-1 block text-sm font-medium text-text">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Figurines, Accessoires..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {/* Aperçu du slug */}
          {name.trim().length > 0 && (
            <p className="mt-1 text-xs text-text-light">
              Slug : <span className="font-mono text-primary">{slug || "..."}</span>
            </p>
          )}
        </div>

        {/* Champ description (optionnel) */}
        <div>
          <label htmlFor="category-description" className="mb-1 block text-sm font-medium text-text">
            Description
          </label>
          <textarea
            id="category-description"
            name="description"
            rows={3}
            defaultValue={category?.description ?? ""}
            placeholder="Description optionnelle de la catégorie..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          />
        </div>

        {/* Toggle actif/inactif */}
        <div className="flex items-center gap-3">
          <label htmlFor="category-active" className="text-sm font-medium text-text">
            Catégorie active
          </label>
          <input
            id="category-active"
            name="isActive"
            type="checkbox"
            value="true"
            defaultChecked={category?.isActive ?? true}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>

        {/* Message d'erreur */}
        {state.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
