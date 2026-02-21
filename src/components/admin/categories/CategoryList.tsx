// Liste des catégories admin — table avec actions modifier/supprimer
// Client component pour gérer l'interactivité (formulaire, confirmation, etc.)

"use client";

import { useState, useCallback } from "react";
import { deleteCategory } from "@/app/admin/categories/actions";
import CategoryForm from "./CategoryForm";

/** Données d'une catégorie avec le nombre de produits */
interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  order: number;
  _count: {
    products: number;
  };
}

interface CategoryListProps {
  /** Liste des catégories chargées côté serveur */
  categories: CategoryWithCount[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  // Catégorie en cours d'édition (null = aucune)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  // Affichage du formulaire de création
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Message d'erreur global (ex: suppression impossible)
  const [error, setError] = useState<string | null>(null);
  // Identifiant de la catégorie en cours de suppression (pour désactiver le bouton)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /** Fermer le formulaire (création ou édition) */
  const handleCloseForm = useCallback(() => {
    setEditingCategory(null);
    setShowCreateForm(false);
  }, []);

  /** Ouvrir le formulaire d'édition pour une catégorie */
  function handleEdit(category: CategoryWithCount) {
    setShowCreateForm(false);
    setEditingCategory(category);
    setError(null);
  }

  /** Ouvrir le formulaire de création */
  function handleCreate() {
    setEditingCategory(null);
    setShowCreateForm(true);
    setError(null);
  }

  /** Supprimer une catégorie avec confirmation */
  async function handleDelete(category: CategoryWithCount) {
    const confirmed = window.confirm(
      `Supprimer la catégorie "${category.name}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(category.id);

    const result = await deleteCategory(category.id);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la suppression.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Bouton de création */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Catégories</h1>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Nouvelle catégorie
        </button>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Formulaire de création */}
      {showCreateForm && (
        <CategoryForm onClose={handleCloseForm} />
      )}

      {/* Formulaire d'édition */}
      {editingCategory && (
        <CategoryForm
          category={{
            id: editingCategory.id,
            name: editingCategory.name,
            description: editingCategory.description,
            isActive: editingCategory.isActive,
          }}
          onClose={handleCloseForm}
        />
      )}

      {/* Table des catégories */}
      {categories.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">Aucune catégorie pour le moment.</p>
          <p className="mt-1 text-sm text-text-light">
            Cliquez sur &quot;Nouvelle catégorie&quot; pour en créer une.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                  Slug
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-light">
                  Produits
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-light">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  {/* Nom */}
                  <td className="px-6 py-4 text-sm font-medium text-text">
                    {category.name}
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4 text-sm font-mono text-text-light">
                    {category.slug}
                  </td>

                  {/* Nombre de produits */}
                  <td className="px-6 py-4 text-center text-sm text-text-light">
                    {category._count.products}
                  </td>

                  {/* Statut actif/inactif */}
                  <td className="px-6 py-4 text-center">
                    {category.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Inactif
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Bouton modifier */}
                      <button
                        onClick={() => handleEdit(category)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg-alt transition-colors"
                      >
                        Modifier
                      </button>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleDelete(category)}
                        disabled={deletingId === category.id}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === category.id ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
