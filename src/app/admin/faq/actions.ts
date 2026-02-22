// Server Actions pour le CRUD des FAQ
// Création, modification, suppression et réordonnancement des items FAQ

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Type de retour standard pour toutes les actions */
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Crée un nouvel item FAQ.
 * L'ordre est défini automatiquement comme le dernier order + 1.
 */
export async function createFaqItem(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const question = formData.get("question");
  const answer = formData.get("answer");

  // Validation de la question (obligatoire)
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return { success: false, error: "La question est obligatoire." };
  }

  // Validation de la réponse (obligatoire)
  if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
    return { success: false, error: "La réponse est obligatoire." };
  }

  // Déterminer l'ordre : placer en dernier
  const lastItem = await prisma.faqItem.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = lastItem ? lastItem.order + 1 : 0;

  // Créer l'item FAQ
  await prisma.faqItem.create({
    data: {
      question: question.trim(),
      answer: answer.trim(),
      order: nextOrder,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");

  return { success: true };
}

/**
 * Met à jour un item FAQ existant.
 */
export async function updateFaqItem(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  // Vérification que l'id est fourni
  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant FAQ manquant." };
  }

  const question = formData.get("question");
  const answer = formData.get("answer");

  // Validation de la question (obligatoire)
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return { success: false, error: "La question est obligatoire." };
  }

  // Validation de la réponse (obligatoire)
  if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
    return { success: false, error: "La réponse est obligatoire." };
  }

  // Vérifier que l'item existe
  const existingItem = await prisma.faqItem.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return { success: false, error: "Item FAQ introuvable." };
  }

  // Mettre à jour l'item
  await prisma.faqItem.update({
    where: { id },
    data: {
      question: question.trim(),
      answer: answer.trim(),
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");

  return { success: true };
}

/**
 * Supprime un item FAQ.
 */
export async function deleteFaqItem(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant FAQ manquant." };
  }

  // Vérifier que l'item existe
  const item = await prisma.faqItem.findUnique({
    where: { id },
  });

  if (!item) {
    return { success: false, error: "Item FAQ introuvable." };
  }

  // Supprimer l'item
  await prisma.faqItem.delete({
    where: { id },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");

  return { success: true };
}

/**
 * Bascule l'état actif/inactif d'un item FAQ.
 */
export async function toggleFaqActive(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant FAQ manquant." };
  }

  // Vérifier que l'item existe
  const item = await prisma.faqItem.findUnique({
    where: { id },
  });

  if (!item) {
    return { success: false, error: "Item FAQ introuvable." };
  }

  // Basculer isActive
  await prisma.faqItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");

  return { success: true };
}

/**
 * Réordonne les items FAQ selon l'ordre du tableau d'identifiants.
 * L'index dans le tableau correspond à la nouvelle valeur de `order`.
 */
export async function reorderFaqItems(ids: string[]): Promise<ActionResult> {
  await requireAdmin();

  if (!ids || ids.length === 0) {
    return { success: false, error: "Liste d'identifiants vide." };
  }

  // Mettre à jour l'ordre de chaque item dans une transaction
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.faqItem.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePath("/admin/faq");
  revalidatePath("/faq");

  return { success: true };
}
