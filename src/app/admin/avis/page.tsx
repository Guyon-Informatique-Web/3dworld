// Page admin de modération des avis
// Server Component : charge tous les avis depuis la base de données

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewModeration from "@/components/admin/reviews/ReviewModeration";

/**
 * Charge tous les avis avec les noms de produits et emails utilisateurs.
 * Trie par date décroissante (récents en premier).
 */
async function getReviews() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    include: {
      product: {
        select: { name: true },
      },
      user: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    isApproved: review.isApproved,
    createdAt: review.createdAt,
    productName: review.product.name,
    userEmail: review.user.email,
  }));
}

/**
 * Page de modération des avis produits.
 * Affiche tous les avis avec filtres et actions (approuver/supprimer).
 */
export default async function ReviewAdminPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-text">Modération des avis</h1>
        <p className="mt-1 text-text-light">
          Gérez les avis des clients, approbation et suppression
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-text-light">Total d'avis</p>
          <p className="mt-1 text-2xl font-bold text-text">{reviews.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-text-light">En attente</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {reviews.filter((r) => !r.isApproved).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-text-light">Approuvés</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {reviews.filter((r) => r.isApproved).length}
          </p>
        </div>
      </div>

      {/* Table de modération */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ReviewModeration reviews={reviews} />
      </div>
    </div>
  );
}
