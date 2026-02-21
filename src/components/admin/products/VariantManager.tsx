// Gestionnaire de variantes produit
// Composant client : liste, creation, modification et suppression des variantes
// Affiche uniquement si le produit a le flag hasVariants active

"use client";

import { useState, useTransition } from "react";
import {
  createVariant,
  updateVariant,
  deleteVariant,
  toggleVariantActive,
} from "@/app/admin/produits/actions";

/** Donnees d'une variante serialisee (Decimal -> string) */
export interface VariantData {
  id: string;
  name: string;
  priceOverride: string | null;
  attributes: Record<string, string>;
  isActive: boolean;
}

interface VariantManagerProps {
  /** Identifiant du produit parent */
  productId: string;
  /** Prix du produit parent (pour affichage par defaut) */
  productPrice: string;
  /** Liste des variantes existantes */
  variants: VariantData[];
}

/** Paire cle/valeur pour les attributs */
interface AttributePair {
  key: string;
  value: string;
}

/** Etat du formulaire de variante */
interface VariantFormState {
  name: string;
  priceOverride: string;
  attributes: AttributePair[];
}

/** Formulaire vierge par defaut */
const EMPTY_FORM: VariantFormState = {
  name: "",
  priceOverride: "",
  attributes: [],
};

export default function VariantManager({
  productId,
  productPrice,
  variants,
}: VariantManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Etat du formulaire (creation ou edition)
  const [form, setForm] = useState<VariantFormState>(EMPTY_FORM);
  // Identifiant de la variante en cours d'edition (null = creation)
  const [editingId, setEditingId] = useState<string | null>(null);
  // Afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false);
  // Confirmation de suppression
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /** Reinitialise le formulaire et ferme l'edition */
  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  /** Ouvre le formulaire en mode creation */
  function handleAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  }

  /** Ouvre le formulaire en mode edition avec les donnees de la variante */
  function handleEdit(variant: VariantData) {
    // Convertir les attributs JSON en paires cle/valeur
    const pairs: AttributePair[] = Object.entries(variant.attributes).map(
      ([key, value]) => ({ key, value })
    );

    setForm({
      name: variant.name,
      priceOverride: variant.priceOverride ?? "",
      attributes: pairs,
    });
    setEditingId(variant.id);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  }

  /** Ajoute une paire d'attribut vide */
  function addAttribute() {
    setForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }],
    }));
  }

  /** Supprime une paire d'attribut par index */
  function removeAttribute(index: number) {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  }

  /** Met a jour une paire d'attribut par index */
  function updateAttribute(index: number, field: "key" | "value", newValue: string) {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: newValue } : attr
      ),
    }));
  }

  /** Soumet le formulaire (creation ou edition) */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Construire le FormData
    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("priceOverride", form.priceOverride);

    // Convertir les paires attributs en objet JSON (filtrer les cles vides)
    const attributesObj: Record<string, string> = {};
    for (const pair of form.attributes) {
      const trimmedKey = pair.key.trim();
      if (trimmedKey.length > 0) {
        attributesObj[trimmedKey] = pair.value.trim();
      }
    }
    formData.set("attributes", JSON.stringify(attributesObj));

    startTransition(async () => {
      const result = editingId
        ? await updateVariant(editingId, formData)
        : await createVariant(productId, formData);

      if (result.success) {
        setSuccess(editingId ? "Variante modifiee." : "Variante creee.");
        resetForm();
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  /** Supprime une variante (avec confirmation) */
  function handleDelete(id: string) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await deleteVariant(id);
      setDeletingId(null);

      if (result.success) {
        setSuccess("Variante supprimee.");
        // Si on editait cette variante, fermer le formulaire
        if (editingId === id) {
          resetForm();
        }
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  /** Active/desactive une variante */
  function handleToggle(id: string) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await toggleVariantActive(id);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl mt-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* En-tete avec titre et bouton d'ajout */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text">
            Variantes du produit
          </h2>
          {!showForm && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ajouter une variante
            </button>
          )}
        </div>

        {/* Messages de succes et d'erreur */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Liste des variantes existantes */}
        {variants.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-text-light">
                  <th className="pb-2 pr-4 font-medium">Nom</th>
                  <th className="pb-2 pr-4 font-medium">Prix</th>
                  <th className="pb-2 pr-4 font-medium">Attributs</th>
                  <th className="pb-2 pr-4 font-medium">Statut</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variants.map((variant) => (
                  <tr key={variant.id} className="text-text">
                    {/* Nom de la variante */}
                    <td className="py-3 pr-4 font-medium">{variant.name}</td>

                    {/* Prix : override ou prix du produit parent */}
                    <td className="py-3 pr-4">
                      {variant.priceOverride ? (
                        <span className="font-medium">
                          {parseFloat(variant.priceOverride).toFixed(2)} EUR
                        </span>
                      ) : (
                        <span className="text-text-light">
                          {parseFloat(productPrice).toFixed(2)} EUR (produit)
                        </span>
                      )}
                    </td>

                    {/* Attributs sous forme de badges */}
                    <td className="py-3 pr-4">
                      {Object.keys(variant.attributes).length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.attributes).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex rounded-full bg-primary-light/20 px-2 py-0.5 text-xs text-primary-dark"
                              >
                                {key}: {value}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-text-light">Aucun</span>
                      )}
                    </td>

                    {/* Statut actif/inactif */}
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          variant.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {variant.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    {/* Boutons d'action */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Bouton modifier */}
                        <button
                          type="button"
                          onClick={() => handleEdit(variant)}
                          disabled={isPending}
                          className="rounded px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-light/20 disabled:opacity-50"
                        >
                          Modifier
                        </button>

                        {/* Bouton activer/desactiver */}
                        <button
                          type="button"
                          onClick={() => handleToggle(variant.id)}
                          disabled={isPending}
                          className="rounded px-2 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 disabled:opacity-50"
                        >
                          {variant.isActive ? "Desactiver" : "Activer"}
                        </button>

                        {/* Bouton supprimer avec confirmation */}
                        {deletingId === variant.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(variant.id)}
                              disabled={isPending}
                              className="rounded px-2 py-1 text-xs font-medium text-white bg-red-600 transition-colors hover:bg-red-700 disabled:opacity-50"
                            >
                              Confirmer
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              disabled={isPending}
                              className="rounded px-2 py-1 text-xs font-medium text-text-light transition-colors hover:bg-gray-100 disabled:opacity-50"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingId(variant.id)}
                            disabled={isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mb-4 text-sm text-text-light">
            Aucune variante pour ce produit. Cliquez sur &quot;Ajouter une
            variante&quot; pour en creer une.
          </p>
        )}

        {/* Formulaire de creation/edition de variante */}
        {showForm && (
          <div className="rounded-lg border border-gray-200 bg-bg-alt p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">
              {editingId ? "Modifier la variante" : "Nouvelle variante"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ nom (obligatoire) */}
              <div>
                <label
                  htmlFor="variant-name"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  id="variant-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex : PLA Blanc - Grande"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Champ prix override (optionnel) */}
              <div>
                <label
                  htmlFor="variant-price"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Prix override (EUR)
                </label>
                <input
                  id="variant-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.priceOverride}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      priceOverride: e.target.value,
                    }))
                  }
                  placeholder={`Vide = prix du produit (${parseFloat(productPrice).toFixed(2)} EUR)`}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <p className="mt-1 text-xs text-text-light">
                  Laissez vide pour utiliser le prix du produit parent.
                </p>
              </div>

              {/* Attributs dynamiques (paires cle/valeur) */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-text">
                    Attributs
                  </label>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-text-light transition-colors hover:bg-gray-50"
                  >
                    Ajouter un attribut
                  </button>
                </div>

                {form.attributes.length > 0 ? (
                  <div className="space-y-2">
                    {form.attributes.map((attr, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {/* Champ cle */}
                        <input
                          type="text"
                          value={attr.key}
                          onChange={(e) =>
                            updateAttribute(index, "key", e.target.value)
                          }
                          placeholder="Cle (ex: couleur)"
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        {/* Champ valeur */}
                        <input
                          type="text"
                          value={attr.value}
                          onChange={(e) =>
                            updateAttribute(index, "value", e.target.value)
                          }
                          placeholder="Valeur (ex: Blanc)"
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        {/* Bouton supprimer la paire */}
                        <button
                          type="button"
                          onClick={() => removeAttribute(index)}
                          className="rounded p-1 text-red-500 transition-colors hover:bg-red-50"
                          title="Supprimer cet attribut"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-light">
                    Aucun attribut. Utilisez &quot;Ajouter un attribut&quot;
                    pour definir des paires cle/valeur (ex: couleur=Blanc,
                    taille=Grande).
                  </p>
                )}
              </div>

              {/* Boutons d'action du formulaire */}
              <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? "Enregistrement..."
                    : editingId
                      ? "Modifier"
                      : "Creer"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isPending}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
