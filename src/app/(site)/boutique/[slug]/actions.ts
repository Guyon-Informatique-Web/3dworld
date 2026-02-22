// Server Actions pour les avis produits
// Création et validation des avis, gestion des erreurs d'unicité

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Type de retour standard */
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Crée un nouvel avis pour un produit.
 * - Vérifie que l'utilisateur est connecté
 * - Valide la note (1-5)
 * - Gère l'erreur de contrainte unique (avis existant)
 * - Revalide le cache de la page produit
 */
export async function createReview(
  productId: string,
  rating: number,
  comment: string | null
): Promise<ActionResult> {
  try {
    // Vérifier l'authentification
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return { success: false, error: "Vous devez être connecté." };
    }

    // Récupérer l'utilisateur Prisma par supabaseId
    const user = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    if (!user) {
      return {
        success: false,
        error: "Utilisateur introuvable. Veuillez vous reconnecter.",
      };
    }

    // Valider la note
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return { success: false, error: "La note doit être entre 1 et 5." };
    }

    // Valider le produit
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Produit introuvable." };
    }

    // Trimmer le commentaire
    const trimmedComment = comment?.trim() || null;

    try {
      // Créer l'avis
      await prisma.review.create({
        data: {
          productId,
          userId: user.id,
          rating,
          comment: trimmedComment,
          isApproved: false,
        },
      });

      // Revalider le cache de la page produit
      revalidatePath(`/boutique/${product.slug}`);

      return { success: true };
    } catch (error: unknown) {
      // Vérifier si c'est une erreur de contrainte unique
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint failed")
      ) {
        return {
          success: false,
          error: "Vous avez déjà laissé un avis pour ce produit.",
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("[ReviewForm] Erreur lors de la création de l'avis:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de l'avis.",
    };
  }
}
