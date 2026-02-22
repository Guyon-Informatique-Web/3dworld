// Table de modération des avis avec filtrage et actions
// Client Component avec onglets pour filtrer (Tous, En attente, Approuvés)

"use client";

import { useState } from "react";
import { approveReview, deleteReview } from "@/app/admin/avis/actions";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: Date;
  productName: string;
  userEmail: string;
}

interface ReviewModerationProps {
  reviews: Review[];
}

/** Types de filtre pour les onglets */
type FilterTab = "tous" | "pending" | "approved";

/**
 * Formate une date au format français : "12 février 2026 à 14:30"
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Formate un commentaire : tronque à 100 caractères si trop long
 */
function formatComment(comment: string | null): string {
  if (!comment) return "(pas de commentaire)";
  return comment.length > 100 ? `${comment.slice(0, 100)}...` : comment;
}

/**
 * Affiche les étoiles basées sur la note
 */
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 10.26 24 10.5 18 16.16 20.16 24 12 19.54 3.84 24 6 16.16 0 10.5 8.91 10.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Table interactive de modération des avis.
 * Affiche les avis avec filtres par statut et boutons d'action.
 */
export default function ReviewModeration({ reviews }: ReviewModerationProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>("pending");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Filtrer les avis selon l'onglet actif
  const filteredReviews = reviews.filter((review) => {
    if (filterTab === "tous") return true;
    if (filterTab === "pending") return !review.isApproved;
    if (filterTab === "approved") return review.isApproved;
    return true;
  });

  // Compter les avis par statut
  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  /**
   * Approuve un avis et recharge
   */
  async function handleApprove(reviewId: string) {
    setIsProcessing(reviewId);
    const result = await approveReview(reviewId);
    if (!result.success) {
      alert(result.error || "Erreur lors de l'approbation");
    }
    setIsProcessing(null);
  }

  /**
   * Supprime un avis avec confirmation
   */
  async function handleDelete(reviewId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    setIsProcessing(reviewId);
    const result = await deleteReview(reviewId);
    if (!result.success) {
      alert(result.error || "Erreur lors de la suppression");
    }
    setIsProcessing(null);
  }

  return (
    <div className="space-y-4">
      {/* Onglets de filtre */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilterTab("pending")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filterTab === "pending"
              ? "border-primary text-primary"
              : "border-transparent text-text-light hover:text-text"
          }`}
        >
          En attente ({pendingCount})
        </button>
        <button
          onClick={() => setFilterTab("approved")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filterTab === "approved"
              ? "border-primary text-primary"
              : "border-transparent text-text-light hover:text-text"
          }`}
        >
          Approuvés ({approvedCount})
        </button>
        <button
          onClick={() => setFilterTab("tous")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filterTab === "tous"
              ? "border-primary text-primary"
              : "border-transparent text-text-light hover:text-text"
          }`}
        >
          Tous ({reviews.length})
        </button>
      </div>

      {/* État vide */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-text-light">
            {filterTab === "pending"
              ? "Aucun avis en attente de modération."
              : filterTab === "approved"
                ? "Aucun avis approuvé."
                : "Aucun avis pour le moment."}
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Produit
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Client
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Note
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Commentaire
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Statut
                </th>
                <th className="px-4 py-3 text-right font-semibold text-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-text font-medium">
                    {review.productName}
                  </td>
                  <td className="px-4 py-3 text-text-light">
                    {review.userEmail}
                  </td>
                  <td className="px-4 py-3">
                    <StarDisplay rating={review.rating} />
                  </td>
                  <td className="px-4 py-3 text-text-light">
                    {formatComment(review.comment)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        review.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.isApproved ? "Approuvé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          disabled={isProcessing === review.id}
                          className="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          Approuver
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={isProcessing === review.id}
                        className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Affichage de la date du dernier avis */}
      {filteredReviews.length > 0 && (
        <div className="text-xs text-text-light">
          <p>Dernier avis : {formatDate(filteredReviews[0].createdAt)}</p>
        </div>
      )}
    </div>
  );
}
