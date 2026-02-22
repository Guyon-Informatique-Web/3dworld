// Affiche la liste des avis approuvés pour un produit
// Server Component : charge les avis depuis la base de données

import { prisma } from "@/lib/prisma";
import StarRating from "./StarRating";

interface ReviewListProps {
  productId: string;
}

/**
 * Charge les avis approuvés pour un produit avec le nom utilisateur.
 * Retourne les avis triés par date décroissante.
 */
async function getReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    userName: review.user.name || "Utilisateur anonyme",
  }));
}

/**
 * Calcule la moyenne des notes et le nombre total d'avis.
 */
function calculateAverageRating(
  reviews: Awaited<ReturnType<typeof getReviews>>
): { average: number; count: number } {
  if (reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / reviews.length, count: reviews.length };
}

/**
 * Formate une date au format français court : "12 février 2026"
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Liste les avis approuvés pour un produit.
 * Affiche la moyenne avec le nombre d'avis, puis chaque avis individuellement.
 */
export default async function ReviewList({ productId }: ReviewListProps) {
  const reviews = await getReviews(productId);
  const { average, count } = calculateAverageRating(reviews);

  return (
    <div>
      {/* En-tête avec statistiques */}
      {count > 0 ? (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <StarRating rating={average} size="md" />
            <span className="text-sm text-text-light">
              {average.toFixed(1)} ({count} avis{count > 1 ? "s" : ""})
            </span>
          </div>
        </div>
      ) : (
        <p className="text-text-light italic">Aucun avis pour le moment.</p>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            {/* Entête avis : auteur, note, date */}
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-text">{review.userName}</p>
                <p className="text-xs text-text-light">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Commentaire */}
            {review.comment && (
              <p className="text-sm text-text-light">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
