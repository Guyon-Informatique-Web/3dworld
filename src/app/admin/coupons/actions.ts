// Server Actions pour le CRUD des coupons
// Création, modification, suppression et activation des coupons

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Crée un nouveau coupon.
 * Valide : code unique, valeur de remise > 0, type valide
 */
export async function createCoupon(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const code = formData.get("code");
  const discountType = formData.get("discountType");
  const discountValue = formData.get("discountValue");
  const minAmount = formData.get("minAmount");
  const maxUses = formData.get("maxUses");
  const expiresAt = formData.get("expiresAt");

  // Validation du code (obligatoire)
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return { success: false, error: "Le code coupon est obligatoire." };
  }

  const trimmedCode = code.trim().toUpperCase();

  // Vérifier l'unicité du code
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code: trimmedCode },
  });

  if (existingCoupon) {
    return { success: false, error: `Un coupon avec le code "${trimmedCode}" existe déjà.` };
  }

  // Validation du type de remise
  if (!discountType || (discountType !== "PERCENTAGE" && discountType !== "FIXED")) {
    return { success: false, error: "Type de remise invalide." };
  }

  // Validation de la valeur de remise (obligatoire, > 0)
  if (!discountValue || typeof discountValue !== "string") {
    return { success: false, error: "La valeur de remise est obligatoire." };
  }

  const discountNum = parseFloat(discountValue);
  if (isNaN(discountNum) || discountNum <= 0) {
    return { success: false, error: "La valeur de remise doit être supérieure à 0." };
  }

  if (discountType === "PERCENTAGE" && discountNum > 100) {
    return { success: false, error: "Un pourcentage ne peut pas dépasser 100%." };
  }

  // Validation montant minimum (optionnel)
  let minAmountNum: number | null = null;
  if (minAmount && typeof minAmount === "string" && minAmount.trim().length > 0) {
    minAmountNum = parseFloat(minAmount);
    if (isNaN(minAmountNum) || minAmountNum <= 0) {
      return { success: false, error: "Le montant minimum doit être supérieur à 0." };
    }
  }

  // Validation utilisations max (optionnel)
  let maxUsesNum: number | null = null;
  if (maxUses && typeof maxUses === "string" && maxUses.trim().length > 0) {
    maxUsesNum = parseInt(maxUses, 10);
    if (isNaN(maxUsesNum) || maxUsesNum <= 0) {
      return { success: false, error: "Le nombre d'utilisations max doit être supérieur à 0." };
    }
  }

  // Validation date expiration (optionnel)
  let expiresAtDate: Date | null = null;
  if (expiresAt && typeof expiresAt === "string" && expiresAt.trim().length > 0) {
    expiresAtDate = new Date(expiresAt);
    if (isNaN(expiresAtDate.getTime())) {
      return { success: false, error: "Date d'expiration invalide." };
    }
  }

  // Créer le coupon
  await prisma.coupon.create({
    data: {
      code: trimmedCode,
      discountType: discountType as "PERCENTAGE" | "FIXED",
      discountValue: discountNum,
      minAmount: minAmountNum,
      maxUses: maxUsesNum,
      expiresAt: expiresAtDate,
      isActive: true,
    },
  });

  revalidatePath("/admin/coupons");

  return { success: true };
}

/**
 * Met à jour un coupon existant.
 * Valide : code unique (sauf si identique), valeur > 0
 */
export async function updateCoupon(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de coupon manquant." };
  }

  // Vérifier que le coupon existe
  const existingCoupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!existingCoupon) {
    return { success: false, error: "Coupon introuvable." };
  }

  const code = formData.get("code");
  const discountType = formData.get("discountType");
  const discountValue = formData.get("discountValue");
  const minAmount = formData.get("minAmount");
  const maxUses = formData.get("maxUses");
  const expiresAt = formData.get("expiresAt");

  // Validation du code
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return { success: false, error: "Le code coupon est obligatoire." };
  }

  const trimmedCode = code.trim().toUpperCase();

  // Vérifier l'unicité du code (sauf si c'est le même coupon)
  if (trimmedCode !== existingCoupon.code) {
    const conflictCoupon = await prisma.coupon.findUnique({
      where: { code: trimmedCode },
    });

    if (conflictCoupon) {
      return { success: false, error: `Un coupon avec le code "${trimmedCode}" existe déjà.` };
    }
  }

  // Validation du type de remise
  if (!discountType || (discountType !== "PERCENTAGE" && discountType !== "FIXED")) {
    return { success: false, error: "Type de remise invalide." };
  }

  // Validation de la valeur de remise
  if (!discountValue || typeof discountValue !== "string") {
    return { success: false, error: "La valeur de remise est obligatoire." };
  }

  const discountNum = parseFloat(discountValue);
  if (isNaN(discountNum) || discountNum <= 0) {
    return { success: false, error: "La valeur de remise doit être supérieure à 0." };
  }

  if (discountType === "PERCENTAGE" && discountNum > 100) {
    return { success: false, error: "Un pourcentage ne peut pas dépasser 100%." };
  }

  // Validation montant minimum
  let minAmountNum: number | null = null;
  if (minAmount && typeof minAmount === "string" && minAmount.trim().length > 0) {
    minAmountNum = parseFloat(minAmount);
    if (isNaN(minAmountNum) || minAmountNum <= 0) {
      return { success: false, error: "Le montant minimum doit être supérieur à 0." };
    }
  }

  // Validation utilisations max
  let maxUsesNum: number | null = null;
  if (maxUses && typeof maxUses === "string" && maxUses.trim().length > 0) {
    maxUsesNum = parseInt(maxUses, 10);
    if (isNaN(maxUsesNum) || maxUsesNum <= 0) {
      return { success: false, error: "Le nombre d'utilisations max doit être supérieur à 0." };
    }
  }

  // Validation date expiration
  let expiresAtDate: Date | null = null;
  if (expiresAt && typeof expiresAt === "string" && expiresAt.trim().length > 0) {
    expiresAtDate = new Date(expiresAt);
    if (isNaN(expiresAtDate.getTime())) {
      return { success: false, error: "Date d'expiration invalide." };
    }
  }

  // Mettre à jour le coupon
  await prisma.coupon.update({
    where: { id },
    data: {
      code: trimmedCode,
      discountType: discountType as "PERCENTAGE" | "FIXED",
      discountValue: discountNum,
      minAmount: minAmountNum,
      maxUses: maxUsesNum,
      expiresAt: expiresAtDate,
    },
  });

  revalidatePath("/admin/coupons");

  return { success: true };
}

/**
 * Supprime un coupon.
 */
export async function deleteCoupon(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de coupon manquant." };
  }

  // Vérifier que le coupon existe
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    return { success: false, error: "Coupon introuvable." };
  }

  // Supprimer le coupon
  await prisma.coupon.delete({
    where: { id },
  });

  revalidatePath("/admin/coupons");

  return { success: true };
}

/**
 * Active ou désactive un coupon.
 */
export async function toggleCouponActive(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de coupon manquant." };
  }

  // Vérifier que le coupon existe
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    return { success: false, error: "Coupon introuvable." };
  }

  // Toggler le statut actif
  await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });

  revalidatePath("/admin/coupons");

  return { success: true };
}
