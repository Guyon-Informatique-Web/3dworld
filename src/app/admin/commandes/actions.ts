// Server Actions pour la gestion des commandes admin
// Mise a jour du statut avec validation du workflow

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";

/** Type de retour standard pour les actions */
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Transitions autorisees pour chaque statut.
 * Definit le workflow de traitement d'une commande :
 * - PENDING : uniquement vers CANCELLED (le paiement n'a pas eu lieu)
 * - PAID : vers PROCESSING ou CANCELLED
 * - PROCESSING : vers SHIPPED ou CANCELLED
 * - SHIPPED : vers DELIVERED ou CANCELLED
 * - DELIVERED : aucune transition (statut final)
 * - CANCELLED : aucune transition (statut final)
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

/**
 * Met a jour le statut d'une commande.
 * Verifie que la transition est autorisee selon le workflow defini.
 * Note : l'envoi d'email au client sera ajoute dans Task 12.
 */
export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus
): Promise<ActionResult> {
  await requireAdmin();

  // Validation des parametres
  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de commande manquant." };
  }

  if (!newStatus) {
    return { success: false, error: "Nouveau statut manquant." };
  }

  // Recuperer la commande actuelle
  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!order) {
    return { success: false, error: "Commande introuvable." };
  }

  // Verifier que la transition est autorisee
  const allowedNext = ALLOWED_TRANSITIONS[order.status];

  if (!allowedNext.includes(newStatus)) {
    return {
      success: false,
      error: `Impossible de passer du statut "${order.status}" a "${newStatus}".`,
    };
  }

  // Mettre a jour le statut
  await prisma.order.update({
    where: { id },
    data: { status: newStatus },
  });

  // Revalider les pages admin commandes
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);
  // Revalider aussi le dashboard (stats)
  revalidatePath("/admin");

  return { success: true };
}
