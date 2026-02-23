// Client Resend + fonctions d'envoi d'emails transactionnels
// Chaque fonction est encapsulee dans un try/catch pour ne jamais bloquer le flux principal
// Les erreurs d'envoi sont loguees mais ne remontent pas

import { Resend } from "resend";
import { createElement } from "react";
import { OrderConfirmation } from "@/components/emails/OrderConfirmation";
import { NewOrderNotification } from "@/components/emails/NewOrderNotification";
import { OrderStatusUpdate } from "@/components/emails/OrderStatusUpdate";
import { ShippingNotification } from "@/components/emails/ShippingNotification";
import { ErrorAlert } from "@/components/emails/ErrorAlert";
import { ReviewApprovalNotification } from "@/components/emails/ReviewApprovalNotification";
import { NewsletterWelcome } from "@/components/emails/NewsletterWelcome";
import type { OrderStatus } from "@/generated/prisma/client";

// Initialisation du client Resend (singleton)
const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse d'expediteur verifiee sur le domaine Hostinger
const FROM_EMAIL = "3D World <noreply@guyon-informatique-web.fr>";

/** Type generique pour les valeurs decimales Prisma (convertibles en number) */
type DecimalLike = { toNumber(): number } | number | string | null;

/** Donnees d'un article de commande pour les templates email */
export interface EmailOrderItem {
  quantity: number;
  unitPrice: DecimalLike;
  product: {
    name: string;
  };
  variant: {
    name: string;
  } | null;
}

/** Donnees de commande necessaires pour les templates email */
export interface EmailOrderData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: OrderStatus;
  totalAmount: DecimalLike;
  shippingMethod: string;
  shippingCost: DecimalLike;
  shippingAddress: string | null;
  items: EmailOrderItem[];
  createdAt: Date;
}

/**
 * Envoie l'email de confirmation de commande au client.
 * Appele apres le paiement reussi (webhook Stripe).
 */
export async function sendOrderConfirmation(order: EmailOrderData): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `Confirmation de commande #${order.id.slice(0, 8).toUpperCase()}`,
      react: createElement(OrderConfirmation, { order }),
    });
    console.log(`Email confirmation commande envoye a ${order.email} (commande ${order.id})`);
  } catch (error) {
    console.error("Erreur envoi email confirmation commande:", error);
  }
}

/**
 * Envoie la notification de nouvelle commande a l'admin.
 * Appele apres le paiement reussi (webhook Stripe).
 */
export async function sendNewOrderNotification(order: EmailOrderData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL manquante — notification admin non envoyee.");
    return;
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `Nouvelle commande #${order.id.slice(0, 8).toUpperCase()} — ${Number(order.totalAmount).toFixed(2)} EUR`,
      react: createElement(NewOrderNotification, { order, appUrl }),
    });
    console.log(`Email notification nouvelle commande envoye a ${adminEmail}`);
  } catch (error) {
    console.error("Erreur envoi email notification admin:", error);
  }
}

/**
 * Envoie l'email de mise a jour de statut au client.
 * Appele depuis l'action admin de changement de statut.
 */
export async function sendOrderStatusUpdate(
  order: EmailOrderData,
  newStatus: OrderStatus
): Promise<void> {
  // Labels lisibles pour chaque statut
  const statusLabels: Record<string, string> = {
    PROCESSING: "en preparation",
    SHIPPED: "expediee",
    DELIVERED: "livree",
    CANCELLED: "annulee",
  };

  const statusLabel = statusLabels[newStatus] ?? newStatus;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `Commande #${order.id.slice(0, 8).toUpperCase()} — ${statusLabel}`,
      react: createElement(OrderStatusUpdate, { order, newStatus }),
    });
    console.log(`Email mise a jour statut envoye a ${order.email} (${newStatus})`);
  } catch (error) {
    console.error("Erreur envoi email mise a jour statut:", error);
  }
}

/**
 * Envoie l'email de notification d'expédition avec numéro de suivi au client.
 * Appele depuis l'action admin quand le numéro de suivi est enregistré.
 */
export async function sendShippingNotification(
  order: EmailOrderData,
  trackingNumber: string,
  trackingUrl?: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `Commande #${order.id.slice(0, 8).toUpperCase()} — Votre colis est en route !`,
      react: createElement(ShippingNotification, {
        order,
        trackingNumber,
        trackingUrl,
      }),
    });
    console.log(
      `Email notification expedition envoye a ${order.email} (commande ${order.id})`
    );
  } catch (error) {
    console.error("Erreur envoi email notification expedition:", error);
  }
}

/** Contexte d'erreur pour l'alerte email */
export interface ErrorContext {
  url?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  additionalInfo?: string;
}

/**
 * Envoie une alerte d'erreur par email a l'adresse de surveillance.
 * Utilise pour les erreurs critiques (webhook, paiement, etc.).
 */
export async function sendErrorAlert(
  error: Error | string,
  context?: ErrorContext
): Promise<void> {
  const alertEmail = process.env.ERROR_ALERT_EMAIL;

  if (!alertEmail) {
    console.error("ERROR_ALERT_EMAIL manquante — alerte non envoyee.");
    return;
  }

  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: alertEmail,
      subject: `[3D World] ERREUR — ${errorMessage.slice(0, 80)}`,
      react: createElement(ErrorAlert, {
        errorMessage,
        errorStack,
        context,
        timestamp: new Date().toISOString(),
      }),
    });
    console.log(`Alerte erreur envoyee a ${alertEmail}`);
  } catch (sendError) {
    // Dernier recours : log en console si meme l'email echoue
    console.error("Impossible d'envoyer l'alerte erreur par email:", sendError);
    console.error("Erreur originale:", errorMessage);
  }
}

/**
 * Envoie l'email de notification d'approbation d'avis au client.
 * Appele apres qu'un admin ait approuve son avis.
 */
export async function sendReviewApprovalNotification(
  customerEmail: string,
  customerName: string,
  productName: string,
  productSlug: string,
  rating: number
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Votre avis sur "${productName}" a été approuvé — 3D World`,
      react: createElement(ReviewApprovalNotification, {
        customerName,
        productName,
        productSlug,
        rating,
      }),
    });
    console.log(`Email approbation avis envoye a ${customerEmail}`);
  } catch (error) {
    console.error("Erreur envoi email approbation avis:", error);
  }
}

/**
 * Envoie l'email de bienvenue newsletter au nouvel abonne.
 * Appele apres l'inscription a la newsletter.
 */
export async function sendNewsletterWelcome(email: string): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Bienvenue dans la newsletter 3D World !",
      react: createElement(NewsletterWelcome, { email }),
    });
    console.log(`Email bienvenue newsletter envoye a ${email}`);
  } catch (error) {
    console.error("Erreur envoi email bienvenue newsletter:", error);
  }
}
