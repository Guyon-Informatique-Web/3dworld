// Liste des abonnés newsletter admin — table avec actions (activer/désactiver, supprimer, export)

"use client";

import { useState } from "react";
import {
  deleteSubscriber,
  toggleSubscriberActive,
  exportSubscribers,
} from "@/app/admin/newsletter/actions";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

interface SubscriberListProps {
  subscribers: Subscriber[];
  activeCount: number;
  totalCount: number;
}

export default function SubscriberList({
  subscribers,
  activeCount,
  totalCount,
}: SubscriberListProps) {
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  async function handleDelete(subscriber: Subscriber) {
    const confirmed = window.confirm(
      `Supprimer l'abonné "${subscriber.email}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(subscriber.id);

    const result = await deleteSubscriber(subscriber.id);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la suppression.");
    }
  }

  async function handleToggle(subscriber: Subscriber) {
    setError(null);
    setTogglingId(subscriber.id);

    const result = await toggleSubscriberActive(subscriber.id);

    setTogglingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la modification.");
    }
  }

  async function handleExport() {
    setError(null);
    setIsExporting(true);

    try {
      const csv = await exportSubscribers();

      // Créer un blob et télécharger
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `newsletter-abonnes-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erreur export:", err);
      setError("Erreur lors de l'export CSV.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et statistiques */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Newsletter</h1>
          <p className="mt-1 text-sm text-text-light">
            {activeCount} inscrit{activeCount > 1 ? "s" : ""} actif
            {activeCount > 1 ? "s" : ""} sur {totalCount} total
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || activeCount === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? "Export..." : "Exporter CSV"}
        </button>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table des abonnés */}
      {subscribers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">Aucun abonné pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Date d'inscription
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
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Email */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-text">{subscriber.email}</span>
                    </td>

                    {/* Date d'inscription */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-light">
                        {formatDate(subscriber.createdAt)}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 text-center">
                      {subscriber.isActive ? (
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
                        {/* Activer/Désactiver */}
                        <button
                          onClick={() => handleToggle(subscriber)}
                          disabled={togglingId === subscriber.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {togglingId === subscriber.id
                            ? "..."
                            : subscriber.isActive
                              ? "Désactiver"
                              : "Activer"}
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(subscriber)}
                          disabled={deletingId === subscriber.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === subscriber.id ? "Suppression..." : "Supprimer"}
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
