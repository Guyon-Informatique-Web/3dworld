// Client Stripe serveur — singleton pour les appels API Stripe
// Utilise la cle secrete STRIPE_SECRET_KEY (jamais exposee cote client)

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY manquante. Verifier .env.local ou le fichier commun."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});
