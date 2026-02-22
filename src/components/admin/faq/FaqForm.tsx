// Formulaire de création/édition d'un item FAQ

"use client";

import { useActionState, useEffect } from "react";
import { createFaqItem, updateFaqItem } from "@/app/admin/faq/actions";

/** Données d'un item FAQ existant (mode édition) */
interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

interface FaqFormProps {
  /** Item à éditer (absent = mode création) */
  item?: FaqItemData;
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

export default function FaqForm({ item, onClose }: FaqFormProps) {
  const isEditing = !!item;

  // Server action wrapper pour le mode création/édition
  async function formAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    if (isEditing) {
      return updateFaqItem(item.id, formData);
    }
    return createFaqItem(formData);
  }

  const [state, dispatch, isPending] = useActionState(formAction, INITIAL_STATE);

  // Fermer le formulaire après un succès
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Titre du formulaire */}
      <h2 className="mb-4 text-lg font-semibold text-text">
        {isEditing ? "Modifier la question" : "Nouvelle question"}
      </h2>

      <form action={dispatch} className="space-y-4">
        {/* Champ question (obligatoire) */}
        <div>
          <label htmlFor="faq-question" className="mb-1 block text-sm font-medium text-text">
            Question <span className="text-red-500">*</span>
          </label>
          <input
            id="faq-question"
            name="question"
            type="text"
            required
            defaultValue={item?.question ?? ""}
            placeholder="Ex : Quels sont les délais de livraison ?"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Champ réponse (obligatoire) */}
        <div>
          <label htmlFor="faq-answer" className="mb-1 block text-sm font-medium text-text">
            Réponse <span className="text-red-500">*</span>
          </label>
          <textarea
            id="faq-answer"
            name="answer"
            rows={4}
            required
            defaultValue={item?.answer ?? ""}
            placeholder="Entrez la réponse détaillée..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
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
