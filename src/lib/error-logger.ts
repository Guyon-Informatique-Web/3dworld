// Logger centralisé d'erreurs avec throttling anti-spam
// Empêche l'envoi de plus d'un email par erreur identique par heure

import { sendErrorAlert, type ErrorContext } from "@/lib/email";

// Cache mémoire pour le throttling (clé = hash erreur, valeur = timestamp dernier envoi)
const throttleCache = new Map<string, number>();

// Fenêtre de throttling : 1 heure
const THROTTLE_WINDOW_MS = 60 * 60 * 1000;

/**
 * Génère une clé unique pour identifier une erreur (basée sur message + fichier source).
 */
function getErrorKey(message: string, source?: string): string {
  const raw = `${message}|${source || "unknown"}`;
  // Hash simple pour la clé
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `err_${hash}`;
}

/**
 * Vérifie si une erreur peut déclencher un email (non throttlée).
 */
function canSendAlert(key: string): boolean {
  const lastSent = throttleCache.get(key);
  if (!lastSent) return true;
  return Date.now() - lastSent > THROTTLE_WINDOW_MS;
}

/**
 * Nettoie les entrées expirées du cache (> 24h).
 */
function cleanThrottleCache(): void {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;
  for (const [key, timestamp] of throttleCache.entries()) {
    if (now - timestamp > maxAge) {
      throttleCache.delete(key);
    }
  }
}

/**
 * Log une erreur et envoie un email d'alerte si non throttlée.
 * Ne bloque jamais le flux principal (async, try/catch interne).
 */
export async function logError(
  error: Error | string,
  context?: ErrorContext & { source?: string }
): Promise<void> {
  const message = error instanceof Error ? error.message : error;
  const source = context?.source || (error instanceof Error ? error.stack?.split("\n")[1]?.trim() : undefined);

  // Toujours log en console
  console.error(`[3D World Error] ${message}`, {
    source,
    url: context?.url,
    method: context?.method,
    timestamp: new Date().toISOString(),
  });

  // Vérifier le throttling
  const key = getErrorKey(message, source);
  if (!canSendAlert(key)) {
    console.log(`[3D World] Alerte throttlée pour: ${message.slice(0, 80)}`);
    return;
  }

  // Marquer comme envoyé
  throttleCache.set(key, Date.now());

  // Nettoyage périodique
  if (throttleCache.size > 100) {
    cleanThrottleCache();
  }

  // Envoyer l'alerte email (non bloquant)
  try {
    await sendErrorAlert(error, context);
  } catch (sendError) {
    console.error("[3D World] Échec envoi alerte:", sendError);
  }
}

/**
 * Wrapper pour les API route handlers.
 * Attrape les erreurs, les log, et retourne une réponse 500.
 */
export function withErrorHandling<T>(
  handler: (request: Request) => Promise<T>
): (request: Request) => Promise<T | Response> {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      await logError(errorObj, {
        url: request.url,
        method: request.method,
        userAgent: request.headers.get("user-agent") || undefined,
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
        source: "api-route",
      });

      const { NextResponse } = await import("next/server");
      return NextResponse.json(
        { error: "Une erreur interne est survenue." },
        { status: 500 }
      );
    }
  };
}
