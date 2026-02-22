// Liste des FAQ admin — table avec actions modifier/supprimer/réordonner
// Client component pour gérer l'interactivité (formulaire, confirmation, etc.)

"use client";

import { useState, useCallback } from "react";
import { deleteFaqItem, toggleFaqActive, reorderFaqItems } from "@/app/admin/faq/actions";
import FaqForm from "./FaqForm";

/** Données d'un item FAQ */
interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface FaqListProps {
  /** Liste des items FAQ chargés côté serveur */
  items: FaqItemData[];
}

export default function FaqList({ items }: FaqListProps) {
  // Item en cours d'édition (null = aucun)
  const [editingItem, setEditingItem] = useState<FaqItemData | null>(null);
  // Affichage du formulaire de création
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Message d'erreur global
  const [error, setError] = useState<string | null>(null);
  // Identifiant de l'item en cours de suppression
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // État local pour la liste (pour les actions optimistes)
  const [localItems, setLocalItems] = useState<FaqItemData[]>(items);

  /** Fermer le formulaire (création ou édition) */
  const handleCloseForm = useCallback(() => {
    setEditingItem(null);
    setShowCreateForm(false);
  }, []);

  /** Ouvrir le formulaire d'édition pour un item */
  function handleEdit(item: FaqItemData) {
    setShowCreateForm(false);
    setEditingItem(item);
    setError(null);
  }

  /** Ouvrir le formulaire de création */
  function handleCreate() {
    setEditingItem(null);
    setShowCreateForm(true);
    setError(null);
  }

  /** Supprimer un item avec confirmation */
  async function handleDelete(item: FaqItemData) {
    const confirmed = window.confirm(
      `Supprimer cette question FAQ ?\n\n"${item.question}"\n\nCette action est irréversible.`
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(item.id);

    const result = await deleteFaqItem(item.id);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la suppression.");
    }
  }

  /** Basculer actif/inactif */
  async function handleToggleActive(item: FaqItemData) {
    setError(null);

    const result = await toggleFaqActive(item.id);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la modification.");
    }
  }

  /** Déplacer un item vers le haut */
  async function handleMoveUp(index: number) {
    if (index === 0) return;

    const newItems = [...localItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setLocalItems(newItems);

    const result = await reorderFaqItems(newItems.map((item) => item.id));

    if (!result.success) {
      // Restaurer l'ordre précédent
      setLocalItems(items);
      setError(result.error ?? "Erreur lors du réordonnancement.");
    }
  }

  /** Déplacer un item vers le bas */
  async function handleMoveDown(index: number) {
    if (index === localItems.length - 1) return;

    const newItems = [...localItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setLocalItems(newItems);

    const result = await reorderFaqItems(newItems.map((item) => item.id));

    if (!result.success) {
      // Restaurer l'ordre précédent
      setLocalItems(items);
      setError(result.error ?? "Erreur lors du réordonnancement.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Bouton de création */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">FAQ</h1>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Nouvelle question
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
        <FaqForm onClose={handleCloseForm} />
      )}

      {/* Formulaire d'édition */}
      {editingItem && (
        <FaqForm
          item={{
            id: editingItem.id,
            question: editingItem.question,
            answer: editingItem.answer,
          }}
          onClose={handleCloseForm}
        />
      )}

      {/* Table des FAQ */}
      {localItems.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">Aucune question pour le moment.</p>
          <p className="mt-1 text-sm text-text-light">
            Cliquez sur &quot;Nouvelle question&quot; pour en créer une.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                  Ordre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                  Question
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
              {localItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* Numéro d'ordre */}
                  <td className="px-6 py-4 text-sm font-medium text-text">
                    {item.order + 1}
                  </td>

                  {/* Question (tronquée) */}
                  <td className="px-6 py-4 text-sm text-text">
                    <span className="max-w-xs truncate block" title={item.question}>
                      {item.question}
                    </span>
                  </td>

                  {/* Statut actif/inactif */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                        item.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {item.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Bouton haut */}
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-text-light hover:bg-bg-alt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Déplacer vers le haut"
                        aria-label="Déplacer vers le haut"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>

                      {/* Bouton bas */}
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === localItems.length - 1}
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-text-light hover:bg-bg-alt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Déplacer vers le bas"
                        aria-label="Déplacer vers le bas"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Bouton modifier */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg-alt transition-colors"
                      >
                        Modifier
                      </button>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === item.id ? "Suppression..." : "Supprimer"}
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
