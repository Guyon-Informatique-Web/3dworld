// Server Action pour la mise a jour des parametres de la boutique
// Upsert de la ligne unique ShopSettings (id="default")

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Type de retour standard pour l'action */
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Met a jour les parametres de la boutique.
 * Cree la ligne si elle n'existe pas encore (upsert avec id="default").
 * Valide les champs avant enregistrement.
 */
export async function updateShopSettings(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  // Extraction des champs du formulaire
  const shippingFixedPriceRaw = formData.get("shippingFixedPrice");
  const freeShippingThresholdRaw = formData.get("freeShippingThreshold");
  const pickupEnabled = formData.get("pickupEnabled") === "true";
  const pickupAddress = formData.get("pickupAddress");

  // Validation des frais de livraison (obligatoire, nombre >= 0)
  if (
    !shippingFixedPriceRaw ||
    typeof shippingFixedPriceRaw !== "string" ||
    shippingFixedPriceRaw.trim().length === 0
  ) {
    return { success: false, error: "Les frais de livraison sont obligatoires." };
  }

  const shippingFixedPrice = parseFloat(shippingFixedPriceRaw);

  if (isNaN(shippingFixedPrice) || shippingFixedPrice < 0) {
    return {
      success: false,
      error: "Les frais de livraison doivent etre un nombre positif ou zero.",
    };
  }

  // Validation du seuil de livraison gratuite (optionnel, mais si renseigne doit etre > 0)
  let freeShippingThreshold: number | null = null;

  if (
    freeShippingThresholdRaw &&
    typeof freeShippingThresholdRaw === "string" &&
    freeShippingThresholdRaw.trim().length > 0
  ) {
    const parsedThreshold = parseFloat(freeShippingThresholdRaw);

    if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
      return {
        success: false,
        error: "Le seuil de livraison gratuite doit etre un nombre strictement positif.",
      };
    }

    freeShippingThreshold = parsedThreshold;
  }

  // Validation de l'adresse de retrait (obligatoire si retrait active)
  let pickupAddressValue: string | null = null;

  if (pickupEnabled) {
    if (
      !pickupAddress ||
      typeof pickupAddress !== "string" ||
      pickupAddress.trim().length === 0
    ) {
      return {
        success: false,
        error: "L'adresse de retrait est obligatoire quand le retrait sur place est active.",
      };
    }
    pickupAddressValue = pickupAddress.trim();
  }

  // Upsert de la ligne ShopSettings (create si absente, update si presente)
  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {
      shippingFixedPrice,
      freeShippingThreshold,
      pickupEnabled,
      pickupAddress: pickupAddressValue,
    },
    create: {
      id: "default",
      shippingFixedPrice,
      freeShippingThreshold,
      pickupEnabled,
      pickupAddress: pickupAddressValue,
    },
  });

  // Revalider les pages qui utilisent les parametres
  revalidatePath("/admin/parametres");
  revalidatePath("/boutique");

  return { success: true };
}
