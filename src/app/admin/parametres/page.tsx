// Page admin des parametres de la boutique
// Charge les ShopSettings depuis Prisma et affiche le formulaire
// Server Component : les donnees sont chargees cote serveur

import { prisma } from "@/lib/prisma";
import ShopSettingsForm from "@/components/admin/settings/ShopSettingsForm";

export const metadata = {
  title: "Parametres - Administration",
};

/** Valeurs par defaut si aucune ligne n'existe en base */
const DEFAULT_SETTINGS = {
  shippingFixedPrice: 5.0,
  freeShippingThreshold: null,
  pickupEnabled: false,
  pickupAddress: null,
} as const;

export default async function AdminParametresPage() {
  // Charger la ligne unique de parametres (id="default")
  const dbSettings = await prisma.shopSettings.findUnique({
    where: { id: "default" },
  });

  // Convertir les Decimal Prisma en number pour le composant client
  const settings = dbSettings
    ? {
        shippingFixedPrice: Number(dbSettings.shippingFixedPrice),
        freeShippingThreshold: dbSettings.freeShippingThreshold
          ? Number(dbSettings.freeShippingThreshold)
          : null,
        pickupEnabled: dbSettings.pickupEnabled,
        pickupAddress: dbSettings.pickupAddress,
      }
    : DEFAULT_SETTINGS;

  return (
    <div>
      {/* Titre de la page */}
      <h1 className="mb-6 text-2xl font-bold text-text">
        Parametres de la boutique
      </h1>

      {/* Formulaire de parametres */}
      <ShopSettingsForm settings={settings} />
    </div>
  );
}
