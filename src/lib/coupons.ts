// Validation et calcul des coupons/codes promotionnels

import { prisma } from "@/lib/prisma";

interface ValidateCouponResult {
  valid: boolean;
  coupon?: {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  };
  error?: string;
}

/**
 * Valide un code coupon pour une commande.
 * Vérifie : existence, activation, expiration, utilisations, montant minimum
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<ValidateCouponResult> {
  // Valider les paramètres
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return { valid: false, error: "Code coupon manquant." };
  }

  if (subtotal <= 0 || !isFinite(subtotal)) {
    return { valid: false, error: "Sous-total invalide." };
  }

  try {
    // Rechercher le coupon (case-insensitive)
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    // Vérifier existence
    if (!coupon) {
      return { valid: false, error: "Code coupon invalide." };
    }

    // Vérifier activation
    if (!coupon.isActive) {
      return { valid: false, error: "Ce coupon est désactivé." };
    }

    // Vérifier expiration
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { valid: false, error: "Ce coupon a expiré." };
    }

    // Vérifier nombre d'utilisations
    if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, error: "Ce coupon a atteint le nombre maximum d'utilisations." };
    }

    // Vérifier montant minimum
    if (coupon.minAmount !== null && subtotal < Number(coupon.minAmount)) {
      return {
        valid: false,
        error: `Le montant minimum pour ce coupon est ${Number(coupon.minAmount).toFixed(2)}€.`,
      };
    }

    // Coupon valide
    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
      },
    };
  } catch (error) {
    console.error("Erreur validation coupon:", error);
    return { valid: false, error: "Erreur lors de la validation du coupon." };
  }
}

/**
 * Calcule le montant de la remise pour un coupon et un sous-total.
 * PERCENTAGE: (discountValue/100) * subtotal
 * FIXED: discountValue (capped at subtotal)
 */
export function calculateDiscount(
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: number,
  subtotal: number
): number {
  if (discountType === "PERCENTAGE") {
    return Math.min((discountValue / 100) * subtotal, subtotal);
  }
  // FIXED
  return Math.min(discountValue, subtotal);
}
