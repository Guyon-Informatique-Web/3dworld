// Liste des coupons admin — table avec actions (éditer, supprimer, toggle actif)

"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCoupon, toggleCouponActive } from "@/app/admin/coupons/actions";

interface CouponItem {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minAmount: string | null;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface CouponListProps {
  coupons: CouponItem[];
  onEditClick: (coupon: CouponItem) => void;
}

export default function CouponList({ coupons, onEditClick }: CouponListProps) {
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function formatPrice(value: string | null): string {
    if (!value) return "-";
    const num = parseFloat(value);
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(num);
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  async function handleDelete(coupon: CouponItem) {
    const confirmed = window.confirm(
      `Supprimer le coupon "${coupon.code}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(coupon.id);

    const result = await deleteCoupon(coupon.id);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la suppression.");
    }
  }

  async function handleToggle(coupon: CouponItem) {
    setError(null);
    setTogglingId(coupon.id);

    const result = await toggleCouponActive(coupon.id);

    setTogglingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la modification.");
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et bouton création */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Coupons</h1>
        <button
          onClick={() =>
            onEditClick({
              id: "",
              code: "",
              discountType: "PERCENTAGE",
              discountValue: "",
              minAmount: null,
              maxUses: null,
              currentUses: 0,
              isActive: true,
              expiresAt: null,
              createdAt: new Date().toISOString(),
            })
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Nouveau coupon
        </button>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table des coupons */}
      {coupons.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">Aucun coupon pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Type & Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Min. €
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Utilisations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Expiration
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
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    {/* Code */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-text">
                        {coupon.code}
                      </span>
                    </td>

                    {/* Type et Valeur */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-text">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${parseFloat(coupon.discountValue)}%`
                          : formatPrice(coupon.discountValue)}
                      </span>
                      <span className="ml-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {coupon.discountType === "PERCENTAGE" ? "%" : "€"}
                      </span>
                    </td>

                    {/* Montant minimum */}
                    <td className="px-6 py-4 text-sm text-text-light">
                      {formatPrice(coupon.minAmount)}
                    </td>

                    {/* Utilisations */}
                    <td className="px-6 py-4 text-sm text-text">
                      {coupon.maxUses ? (
                        <span>
                          {coupon.currentUses} / {coupon.maxUses}
                        </span>
                      ) : (
                        <span className="text-text-light">Illimité</span>
                      )}
                    </td>

                    {/* Expiration */}
                    <td className="px-6 py-4 text-sm">
                      {isExpired(coupon.expiresAt) && coupon.expiresAt ? (
                        <span className="text-red-600 font-medium">
                          Expiré
                        </span>
                      ) : coupon.expiresAt ? (
                        <span className="text-text-light">
                          {formatDate(coupon.expiresAt)}
                        </span>
                      ) : (
                        <span className="text-text-light">-</span>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 text-center">
                      {coupon.isActive ? (
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
                        {/* Modifier */}
                        <button
                          onClick={() => onEditClick(coupon)}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg-alt transition-colors"
                        >
                          Modifier
                        </button>

                        {/* Activer/Désactiver */}
                        <button
                          onClick={() => handleToggle(coupon)}
                          disabled={togglingId === coupon.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {togglingId === coupon.id
                            ? "..."
                            : coupon.isActive
                              ? "Désactiver"
                              : "Activer"}
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(coupon)}
                          disabled={deletingId === coupon.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === coupon.id ? "Suppression..." : "Supprimer"}
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
