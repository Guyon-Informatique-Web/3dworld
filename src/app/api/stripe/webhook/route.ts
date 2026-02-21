// POST /api/stripe/webhook — recoit les evenements Stripe
// Verifie la signature du webhook avec le secret STRIPE_WEBHOOK_SECRET
// Met a jour le statut des commandes apres paiement reussi

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateOrderStatus } from "@/lib/orders";
import type Stripe from "stripe";

// Forcer le runtime Node.js (necessaire pour le traitement du body brut)
export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET manquante.");
    return NextResponse.json(
      { error: "Configuration webhook manquante." },
      { status: 500 }
    );
  }

  // Lire le body brut pour la verification de signature Stripe
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature Stripe manquante." },
      { status: 400 }
    );
  }

  // Verifier la signature de l'evenement
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Signature invalide";
    console.error("Erreur verification signature webhook:", message);
    return NextResponse.json(
      { error: `Signature invalide : ${message}` },
      { status: 400 }
    );
  }

  // Traiter les evenements pertinents
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error(
          "Webhook checkout.session.completed : orderId manquant dans les metadata."
        );
        break;
      }

      try {
        // Mettre a jour la commande en PAID avec l'ID de session Stripe
        await updateOrderStatus(orderId, "PAID", session.id);
        console.log(
          `Commande ${orderId} mise a jour en PAID (session: ${session.id})`
        );
      } catch (error) {
        console.error(
          `Erreur mise a jour commande ${orderId}:`,
          error
        );
        // On retourne quand meme 200 pour eviter les retries Stripe sur une erreur BDD
        // Les emails de notification seront ajoutes dans Task 12
      }
      break;
    }

    default:
      // Evenements non geres — on les ignore silencieusement
      break;
  }

  // Toujours retourner 200 pour confirmer la reception a Stripe
  return NextResponse.json({ received: true });
}
