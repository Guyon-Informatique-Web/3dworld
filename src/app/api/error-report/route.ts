// Endpoint POST /api/error-report — reçoit les erreurs frontend
// Accessible sans authentification (skipAuth)

import { NextResponse } from "next/server";
import { logError } from "@/lib/error-logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation basique des champs
    const message = typeof body.message === "string" ? body.message.slice(0, 1000) : "Erreur inconnue";
    const source = typeof body.source === "string" ? body.source.slice(0, 500) : undefined;
    const stack = typeof body.stack === "string" ? body.stack.slice(0, 2000) : undefined;
    const url = typeof body.url === "string" ? body.url.slice(0, 500) : undefined;

    // Enrichir le contexte avec les headers serveur
    const userAgent = request.headers.get("user-agent") || undefined;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;

    const error = new Error(message);
    if (stack) error.stack = stack;

    await logError(error, {
      url,
      method: "CLIENT",
      userAgent,
      ip,
      source: source || "frontend",
      additionalInfo: `Erreur capturée côté client`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur de traitement" }, { status: 400 });
  }
}
