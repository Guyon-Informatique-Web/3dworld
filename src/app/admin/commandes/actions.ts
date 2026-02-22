// Server Actions pour la gestion des commandes admin
// Mise a jour du statut avec validation du workflow
// Envoie un email au client lors du changement de statut

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdate, sendShippingNotification } from "@/lib/email";
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
      // Si passage a SHIPPED avec numéro de suivi, envoyer notification d'expedition
      if (newStatus === "SHIPPED" && fullOrder.trackingNumber) {
        sendShippingNotification(
          fullOrder,
          fullOrder.trackingNumber,
          fullOrder.trackingUrl ?? undefined
        ).catch((error) => {
          console.error("Erreur envoi email notification expedition:", error);
        });
      } else {
        // Sinon, envoi asynchrone mise a jour statut standard
        sendOrderStatusUpdate(fullOrder, newStatus).catch((error) => {
          console.error("Erreur envoi email mise a jour statut:", error);
        });
      }
    }
  }

  // Revalider les pages admin commandes
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);
  // Revalider aussi le dashboard (stats)
  revalidatePath("/admin");

  return { success: true };
}

/**
 * Enregistre le numéro de suivi d'une commande.
 * Envoie un email de notification au client avec le numéro de suivi.
 */
export async function updateTracking(
  id: string,
  trackingNumber: string,
  trackingUrl?: string
): Promise<ActionResult> {
  await requireAdmin();

  // Validation des parametres
  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de commande manquant." };
  }

  if (!trackingNumber || trackingNumber.trim().length === 0) {
    return { success: false, error: "Numéro de suivi manquant." };
  }

  // Recuperer la commande actuelle
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!order) {
    return { success: false, error: "Commande introuvable." };
  }

  // Mettre a jour le numéro et URL de suivi
  await prisma.order.update({
    where: { id },
    data: {
      trackingNumber: trackingNumber.trim(),
      trackingUrl: trackingUrl ? trackingUrl.trim() : null,
    },
  });

  // Envoyer l'email si le statut est SHIPPED ou PROCESSING
  if (["SHIPPED", "PROCESSING"].includes(order.status)) {
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
      sendShippingNotification(
        fullOrder,
        trackingNumber.trim(),
        trackingUrl ? trackingUrl.trim() : undefined
      ).catch((error) => {
        console.error("Erreur envoi email notification expedition:", error);
      });
    }
  }

  // Revalider les pages
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);

  return { success: true };
}
