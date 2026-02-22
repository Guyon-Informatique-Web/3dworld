// Server Actions pour la gestion des abonnés newsletter
// Suppression, basculement d'activation, export CSV

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Supprime un abonné newsletter.
 */
export async function deleteSubscriber(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant d'abonné manquant." };
  }

  // Vérifier que l'abonné existe
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });

  if (!subscriber) {
    return { success: false, error: "Abonné introuvable." };
  }

  // Supprimer l'abonné
  await prisma.newsletterSubscriber.delete({
    where: { id },
  });

  revalidatePath("/admin/newsletter");

  return { success: true };
}

/**
 * Bascule l'activation d'un abonné.
 */
export async function toggleSubscriberActive(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant d'abonné manquant." };
  }

  // Vérifier que l'abonné existe
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });

  if (!subscriber) {
    return { success: false, error: "Abonné introuvable." };
  }

  // Basculer le statut actif
  await prisma.newsletterSubscriber.update({
    where: { id },
    data: { isActive: !subscriber.isActive },
  });

  revalidatePath("/admin/newsletter");

  return { success: true };
}

/**
 * Exporte les abonnés actifs en CSV.
 * Colonnes: Email;Date d'inscription
 */
export async function exportSubscribers(): Promise<string> {
  await requireAdmin();

  // Récupérer tous les abonnés actifs
  const activeSubscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  // En-tête CSV
  let csv = "Email;Date d'inscription\n";

  // Ajouter chaque abonné
  activeSubscribers.forEach((subscriber) => {
    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(subscriber.createdAt);

    csv += `${subscriber.email};${formattedDate}\n`;
  });

  return csv;
}
