// Formulaire de checkout — informations client, choix livraison et récapitulatif
// Composant client : utilise le CartContext et le client Supabase pour pré-remplir

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import type { ShippingMethod } from "@/generated/prisma/client";

/** Paramètres boutique chargés côté serveur et passés en props */
interface ShopSettingsData {
  shippingFixedPrice: number;
  freeShippingThreshold: number | null;
  pickupEnabled: boolean;
  pickupAddress: string | null;
}

interface CheckoutFormProps {
  shopSettings: ShopSettingsData;
}

export default function CheckoutForm({ shopSettings }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();

  // Champs formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("DELIVERY");
  const [shippingAddress, setShippingAddress] = useState("");

  // État du formulaire
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pré-remplir avec les infos de l'utilisateur connecté
  useEffect(() => {
    async function prefillUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email ?? "");
          setName(user.user_metadata?.name ?? "");
        }
      } catch {
        // Pas de session — on ne pré-remplit pas
      }
    }

    prefillUser();
  }, []);

  // Calculer les frais de livraison
  const isDelivery = shippingMethod === "DELIVERY";
  const isFreeShipping =
    shopSettings.freeShippingThreshold !== null &&
    subtotal >= shopSettings.freeShippingThreshold;
  const shippingCost = isDelivery && !isFreeShipping ? shopSettings.shippingFixedPrice : 0;
  const total = subtotal + shippingCost;

  // Si le panier est vide, ne pas afficher le formulaire
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="mb-2 text-xl font-semibold text-text">
          Votre panier est vide
        </h2>
        <p className="mb-6 text-text-light">
          Ajoutez des articles avant de passer commande.
        </p>
        <Link
          href="/boutique"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  /** Soumettre le formulaire — creer la session Stripe et rediriger */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation basique côté client
      if (!name.trim() || !email.trim()) {
        setError("Le nom et l'email sont obligatoires.");
        setIsLoading(false);
        return;
      }

      if (isDelivery && !shippingAddress.trim()) {
        setError("L'adresse de livraison est obligatoire.");
        setIsLoading(false);
        return;
      }

      // Appeler l'API checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          shippingMethod,
          shippingAddress: isDelivery ? shippingAddress.trim() : undefined,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setIsLoading(false);
        return;
      }

      // Vider le panier avant la redirection vers Stripe
      clearCart();

      // Rediriger vers Stripe Checkout
      router.push(data.url);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      {/* Formulaire informations client + livraison (2/3) */}
      <div className="space-y-6 lg:col-span-2">
        {/* Informations client */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-text">
            Vos informations
          </h2>

          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label
                htmlFor="checkout-name"
                className="mb-1 block text-sm font-medium text-text"
              >
                Nom complet *
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="checkout-email"
                className="mb-1 block text-sm font-medium text-text"
              >
                Email *
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@exemple.fr"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label
                htmlFor="checkout-phone"
                className="mb-1 block text-sm font-medium text-text"
              >
                Téléphone{" "}
                <span className="text-text-light">(optionnel)</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Mode de livraison */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-text">
            Mode de livraison
          </h2>

          <div className="space-y-3">
            {/* Option livraison */}
            <label
              htmlFor="shipping-delivery"
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                shippingMethod === "DELIVERY"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                id="shipping-delivery"
                type="radio"
                name="shippingMethod"
                value="DELIVERY"
                checked={shippingMethod === "DELIVERY"}
                onChange={() => setShippingMethod("DELIVERY")}
                className="mt-1 accent-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text">
                    Livraison à domicile
                  </span>
                  <span className="text-sm font-semibold text-text">
                    {isFreeShipping
                      ? "Gratuit"
                      : formatPrice(shopSettings.shippingFixedPrice)}
                  </span>
                </div>
                {shopSettings.freeShippingThreshold !== null && !isFreeShipping && (
                  <p className="mt-1 text-xs text-text-light">
                    Gratuit à partir de{" "}
                    {formatPrice(shopSettings.freeShippingThreshold)}
                  </p>
                )}
              </div>
            </label>

            {/* Option retrait (si active dans les paramètres) */}
            {shopSettings.pickupEnabled && (
              <label
                htmlFor="shipping-pickup"
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  shippingMethod === "PICKUP"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  id="shipping-pickup"
                  type="radio"
                  name="shippingMethod"
                  value="PICKUP"
                  checked={shippingMethod === "PICKUP"}
                  onChange={() => setShippingMethod("PICKUP")}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text">
                      Retrait sur place
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      Gratuit
                    </span>
                  </div>
                  {shopSettings.pickupAddress && (
                    <p className="mt-1 text-xs text-text-light">
                      {shopSettings.pickupAddress}
                    </p>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* Adresse de livraison (visible uniquement si livraison selectionnee) */}
          {isDelivery && (
            <div className="mt-4">
              <label
                htmlFor="checkout-address"
                className="mb-1 block text-sm font-medium text-text"
              >
                Adresse de livraison *
              </label>
              <textarea
                id="checkout-address"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="12 rue de la Paix&#10;75002 Paris"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Récapitulatif commande (1/3) */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-text">
            Récapitulatif
          </h2>

          {/* Liste des articles */}
          <div className="mb-4 max-h-64 space-y-3 overflow-y-auto border-b border-gray-100 pb-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="flex items-start justify-between gap-2 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text truncate">
                    {item.name}
                  </p>
                  {item.variantName && (
                    <p className="text-xs text-text-light">
                      {item.variantName}
                    </p>
                  )}
                  <p className="text-xs text-text-light">
                    Qte : {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-medium text-text">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totaux */}
          <div className="space-y-2 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">
                Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})
              </span>
              <span className="font-medium text-text">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">Livraison</span>
              <span className="font-medium text-text">
                {shippingCost > 0 ? formatPrice(shippingCost) : "Gratuit"}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-4">
            <span className="text-base font-bold text-text">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Bouton Payer */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Redirection vers le paiement..." : "Payer"}
          </button>

          {/* Lien retour panier */}
          <Link
            href="/panier"
            className="mt-3 block text-center text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Retour au panier
          </Link>
        </div>
      </div>
    </form>
  );
}
