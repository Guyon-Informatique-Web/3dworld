// Formulaire pour poster un nouvel avis produit
// Client Component avec authentification et validation

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import StarRating from "./StarRating";
import { createReview } from "@/app/(site)/boutique/[slug]/actions";

interface ReviewFormProps {
  productId: string;
}

/**
 * Formulaire interactif pour laisser un avis.
 * Vérifie que l'utilisateur est connecté, propose un sélecteur de note,
 * un champ commentaire optionnel, et un bouton de soumission.
 */
export default function ReviewForm({ productId }: ReviewFormProps) {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Vérifier l'authentification au chargement
  useEffect(() => {
    (async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      setUser(supabaseUser ? { id: supabaseUser.id } : null);
      setLoading(false);
    })();
  }, [supabase]);

  /**
   * Soumet l'avis en appelant la server action createReview.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await createReview(productId, rating, comment || null);

      if (!result.success) {
        setErrorMessage(
          result.error ||
            "Une erreur est survenue. Veuillez réessayer."
        );
      } else {
        setSuccessMessage(
          "Merci ! Votre avis sera visible après modération."
        );
        setRating(5);
        setComment("");
        // Réinitialiser après 3 secondes
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="py-4 text-text-light">Chargement...</div>;
  }

  // Non authentifié : afficher le message avec lien de connexion
  if (!user) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-text-light">
          Connectez-vous pour laisser un avis{" "}
          <Link
            href="/connexion"
            className="font-medium text-primary hover:text-primary/80"
          >
            Cliquez ici pour vous connecter
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Messages d'erreur/succès */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Sélecteur de note */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text">
          Votre note
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
          disabled={isSubmitting}
        />
      </div>

      {/* Champ commentaire */}
      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-medium text-text">
          Votre avis (optionnel)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit..."
          maxLength={500}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          rows={4}
        />
        <p className="mt-1 text-xs text-text-light">
          {comment.length}/500 caractères
        </p>
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer mon avis"}
      </button>
    </form>
  );
}
