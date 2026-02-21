// Formulaire des parametres de la boutique
// Permet de configurer livraison, seuil gratuit et retrait sur place

"use client";

import { useActionState, useState } from "react";
import { updateShopSettings } from "@/app/admin/parametres/actions";

/** Donnees initiales des parametres (depuis Prisma ou valeurs par defaut) */
interface ShopSettingsData {
  shippingFixedPrice: number;
  freeShippingThreshold: number | null;
  pickupEnabled: boolean;
  pickupAddress: string | null;
}

interface ShopSettingsFormProps {
  /** Parametres actuels de la boutique */
  settings: ShopSettingsData;
}

/** Type de retour de la server action */
interface ActionResult {
  success: boolean;
  error?: string;
}

/** Etat initial du formulaire */
const INITIAL_STATE: ActionResult = { success: false, error: undefined };

export default function ShopSettingsForm({ settings }: ShopSettingsFormProps) {
  // Etat local pour le toggle retrait (afficher/masquer l'adresse)
  const [pickupEnabled, setPickupEnabled] = useState(settings.pickupEnabled);

  // Etat pour le message de succes (disparait apres 3 secondes)
  const [showSuccess, setShowSuccess] = useState(false);

  // Server action avec useActionState
  async function formAction(
    _prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> {
    const result = await updateShopSettings(formData);

    if (result.success) {
      setShowSuccess(true);
      // Masquer le message de succes apres 3 secondes
      setTimeout(() => setShowSuccess(false), 3000);
    }

    return result;
  }

  const [state, dispatch, isPending] = useActionState(formAction, INITIAL_STATE);

  return (
    <div className="mx-auto max-w-2xl">
      <form action={dispatch} className="space-y-6">
        {/* Section Livraison */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-text">Livraison</h2>

          <div className="space-y-4">
            {/* Frais de livraison fixes */}
            <div>
              <label
                htmlFor="shippingFixedPrice"
                className="mb-1 block text-sm font-medium text-text"
              >
                Frais de livraison fixes <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="shippingFixedPrice"
                  name="shippingFixedPrice"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={settings.shippingFixedPrice}
                  placeholder="5.00"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-light">
                  &euro;
                </span>
              </div>
              <p className="mt-1 text-xs text-text-light">
                Montant fixe applique a chaque commande livree.
              </p>
            </div>

            {/* Seuil de livraison gratuite */}
            <div>
              <label
                htmlFor="freeShippingThreshold"
                className="mb-1 block text-sm font-medium text-text"
              >
                Seuil de livraison gratuite
              </label>
              <div className="relative">
                <input
                  id="freeShippingThreshold"
                  name="freeShippingThreshold"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={settings.freeShippingThreshold ?? ""}
                  placeholder="50.00"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-light">
                  &euro;
                </span>
              </div>
              <p className="mt-1 text-xs text-text-light">
                Laisser vide pour desactiver la livraison gratuite.
              </p>
            </div>
          </div>
        </div>

        {/* Section Retrait sur place */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-text">Retrait sur place</h2>

          <div className="space-y-4">
            {/* Toggle retrait active */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="pickupEnabled"
                className="text-sm font-medium text-text"
              >
                Activer le retrait sur place
              </label>
              {/* Champ hidden pour envoyer la valeur meme si la checkbox est decochee */}
              <input type="hidden" name="pickupEnabled" value="false" />
              <input
                id="pickupEnabled"
                name="pickupEnabled"
                type="checkbox"
                value="true"
                checked={pickupEnabled}
                onChange={(e) => setPickupEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            {/* Adresse de retrait (visible seulement si retrait active) */}
            {pickupEnabled && (
              <div>
                <label
                  htmlFor="pickupAddress"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Adresse de retrait <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  rows={3}
                  required
                  defaultValue={settings.pickupAddress ?? ""}
                  placeholder="Ex : 12 rue de la Paix, 75002 Paris"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
                <p className="mt-1 text-xs text-text-light">
                  Adresse affichee au client lors du choix du mode de livraison.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message d'erreur */}
        {state.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Message de succes */}
        {showSuccess && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Parametres enregistres avec succes.
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Enregistrement..." : "Enregistrer les parametres"}
          </button>
        </div>
      </form>
    </div>
  );
}
