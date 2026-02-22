// Server Actions pour la modération des avis
// Approbation et suppression des avis avec vérification admin

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Type de retour standard */
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Approuve un avis (isApproved = true).
 * Vérifie que l'utilisateur est admin.
 * Revalide le cache de la page produit.
 */
export async function approveReview(reviewId: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!reviewId || reviewId.trim().length === 0) {
      return { success: false, error: "Identifiant d'avis manquant." };
    }

    // Récupérer l'avis et le produit associé
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        product: {
          select: { slug: true },
        },
      },
    });

    if (!review) {
      return { success: false, error: "Avis introuvable." };
    }

    // Approuver l'avis
    await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });

    // Revalider les pages concernées
    revalidatePath(`/boutique/${review.product.slug}`);
    revalidatePath("/admin/avis");

    return { success: true };
  } catch (error) {
    console.error("[ReviewActions] Erreur lors de l'approbation d'avis:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'approbation de l'avis.",
    };
  }
}

/**
 * Supprime un avis de la base de données.
 * Vérifie que l'utilisateur est admin.
 * Revalide le cache de la page produit.
 */
export async function deleteReview(reviewId: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!reviewId || reviewId.trim().length === 0) {
      return { success: false, error: "Identifiant d'avis manquant." };
    }

    // Récupérer l'avis et le produit associé
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        product: {
          select: { slug: true },
        },
      },
    });

    if (!review) {
      return { success: false, error: "Avis introuvable." };
    }

    // Supprimer l'avis
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Revalider les pages concernées
    revalidatePath(`/boutique/${review.product.slug}`);
    revalidatePath("/admin/avis");

    return { success: true };
  } catch (error) {
    console.error("[ReviewActions] Erreur lors de la suppression d'avis:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression de l'avis.",
    };
  }
}
