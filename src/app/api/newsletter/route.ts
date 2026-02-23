// API route pour l'inscription à la newsletter
// POST /api/newsletter — accepte { email } et crée/met à jour un abonné

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterWelcome } from "@/lib/email";

// Validation email avec regex simple
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email requis." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, message: "Email invalide." },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      if (existing.isActive) {
        // Déjà inscrit et actif
        return NextResponse.json(
          {
            success: false,
            message: "Vous êtes déjà inscrit !",
          },
          { status: 400 }
        );
      } else {
        // Réactiver l'abonné
        await prisma.newsletterSubscriber.update({
          where: { email: trimmedEmail },
          data: { isActive: true },
        });

        // Envoyer l'email de bienvenue
        await sendNewsletterWelcome(trimmedEmail);

        return NextResponse.json(
          {
            success: true,
            message: "Inscription réussie ! Merci.",
          },
          { status: 200 }
        );
      }
    }

    // Créer nouvel abonné
    await prisma.newsletterSubscriber.create({
      data: {
        email: trimmedEmail,
        isActive: true,
      },
    });

    // Envoyer l'email de bienvenue
    await sendNewsletterWelcome(trimmedEmail);

    return NextResponse.json(
      {
        success: true,
        message: "Inscription réussie ! Merci.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API newsletter:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
