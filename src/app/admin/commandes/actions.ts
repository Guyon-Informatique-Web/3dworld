// Server Actions pour la gestion des commandes admin
// Mise a jour du statut avec validation du workflow
// Envoie un email au client lors du changement de statut

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdate } from "@/lib/email";
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
 * Envoie un email de notification au client pour les statuts pertinents.
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

  // Envoyer un email au client pour les statuts pertinents
  const statusesWithEmail: OrderStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (statusesWithEmail.includes(newStatus)) {
    // Recuperer la commande complete avec articles pour le template email
    const fullOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { name: true } },
            variant: { select: { name: true } },
          },
        },
      },
    });

    if (fullOrder) {
      // Envoi asynchrone — ne bloque pas la reponse de l'action
      sendOrderStatusUpdate(fullOrder, newStatus).catch((error) => {
        console.error("Erreur envoi email mise a jour statut:", error);
      });
    }
  }

  // Revalider les pages admin commandes
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);
  // Revalider aussi le dashboard (stats)
  revalidatePath("/admin");

  return { success: true };
}
