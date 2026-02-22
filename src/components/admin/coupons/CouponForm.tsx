// Formulaire de création/édition d'un coupon
// Champs : code, type de remise, valeur, montant min, max utilisations, date expiration

"use client";

import { useActionState, useState, useEffect } from "react";
import { createCoupon, updateCoupon } from "@/app/admin/coupons/actions";

interface CouponData {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minAmount: string | null;
  maxUses: number | null;
  expiresAt: string | null;
}

interface CouponFormProps {
  coupon?: CouponData;
  onClose: () => void;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

const INITIAL_STATE: ActionResult = { success: false, error: undefined };

export default function CouponForm({ coupon, onClose }: CouponFormProps) {
  const isEditing = !!coupon;

  // État du code pour conversion uppercase
  const [code, setCode] = useState(coupon?.code ?? "");

  // Server action wrapper
  async function formAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    if (isEditing) {
      return updateCoupon(coupon.id, formData);
    }
    return createCoupon(formData);
  }

  const [state, dispatch, isPending] = useActionState(formAction, INITIAL_STATE);

  // Fermer le formulaire après succès
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-text">
        {isEditing ? "Modifier le coupon" : "Nouveau coupon"}
      </h2>

      <form action={dispatch} className="space-y-4">
        {/* Code (obligatoire) */}
        <div>
          <label htmlFor="coupon-code" className="mb-1 block text-sm font-medium text-text">
            Code coupon <span className="text-red-500">*</span>
          </label>
          <input
            id="coupon-code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="EX: SUMMER2025"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-text-light">
            Le code sera automatiquement converti en majuscules
          </p>
        </div>

        {/* Type de remise (obligatoire) */}
        <div>
          <label htmlFor="coupon-type" className="mb-1 block text-sm font-medium text-text">
            Type de remise <span className="text-red-500">*</span>
          </label>
          <select
            id="coupon-type"
            name="discountType"
            required
            defaultValue={coupon?.discountType ?? "PERCENTAGE"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="PERCENTAGE">Pourcentage (%)</option>
            <option value="FIXED">Montant fixe (€)</option>
          </select>
        </div>

        {/* Valeur de remise (obligatoire) */}
        <div>
          <label htmlFor="coupon-value" className="mb-1 block text-sm font-medium text-text">
            Valeur de remise <span className="text-red-500">*</span>
          </label>
          <input
            id="coupon-value"
            name="discountValue"
            type="number"
            required
            step="0.01"
            min="0"
            defaultValue={coupon?.discountValue ?? ""}
            placeholder="Ex: 10 ou 5.50"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Montant minimum (optionnel) */}
        <div>
          <label htmlFor="coupon-min" className="mb-1 block text-sm font-medium text-text">
            Montant minimum (€)
          </label>
          <input
            id="coupon-min"
            name="minAmount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={coupon?.minAmount ?? ""}
            placeholder="Ex: 50"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-text-light">
            Montant minimum du panier requis pour appliquer ce coupon
          </p>
        </div>

        {/* Utilisations max (optionnel) */}
        <div>
          <label htmlFor="coupon-max" className="mb-1 block text-sm font-medium text-text">
            Nombre d'utilisations max
          </label>
          <input
            id="coupon-max"
            name="maxUses"
            type="number"
            min="1"
            defaultValue={coupon?.maxUses ?? ""}
            placeholder="Ex: 100"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-text-light">
            Laissez vide pour illimité
          </p>
        </div>

        {/* Date d'expiration (optionnel) */}
        <div>
          <label htmlFor="coupon-expires" className="mb-1 block text-sm font-medium text-text">
            Date d'expiration
          </label>
          <input
            id="coupon-expires"
            name="expiresAt"
            type="datetime-local"
            defaultValue={coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-text-light">
            Laissez vide pour pas de date d'expiration
          </p>
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
