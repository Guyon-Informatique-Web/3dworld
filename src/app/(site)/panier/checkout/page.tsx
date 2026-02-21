// Page checkout — formulaire de commande avant paiement Stripe
// Server Component pour charger les paramètres boutique (frais de livraison, retrait)
// Le formulaire client (CheckoutForm) reçoit les settings en props

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "@/components/shop/CheckoutForm";

// Empecher le prerendering statique (requete Prisma au runtime)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finaliser la commande",
  description:
    "Renseignez vos informations et choisissez votre mode de livraison pour finaliser votre commande.",
};

export default async function CheckoutPage() {
  // Charger les paramètres boutique pour les frais de livraison
  const settings = await prisma.shopSettings.findUnique({
    where: { id: "default" },
    select: {
      shippingFixedPrice: true,
      freeShippingThreshold: true,
      pickupEnabled: true,
      pickupAddress: true,
    },
  });

  // Valeurs par défaut si aucun paramètre configuré
  const shopSettings = {
    shippingFixedPrice: settings ? Number(settings.shippingFixedPrice) : 5,
    freeShippingThreshold: settings?.freeShippingThreshold
      ? Number(settings.freeShippingThreshold)
      : null,
    pickupEnabled: settings?.pickupEnabled ?? false,
    pickupAddress: settings?.pickupAddress ?? null,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-text">
        Finaliser la commande
      </h1>

      <CheckoutForm shopSettings={shopSettings} />
    </div>
  );
}
