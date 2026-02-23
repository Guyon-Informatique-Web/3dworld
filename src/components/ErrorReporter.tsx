"use client";

// Composant client qui capture les erreurs JS non attrapées
// et les envoie à /api/error-report

import { useEffect } from "react";

export default function ErrorReporter() {
  useEffect(() => {
    // Capture les erreurs JS globales
    function handleError(event: ErrorEvent) {
      reportError({
        message: event.message,
        source: `${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error?.stack,
        url: window.location.href,
      });
    }

    // Capture les promesses rejetées non attrapées
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const message = event.reason instanceof Error
        ? event.reason.message
        : String(event.reason);
      const stack = event.reason instanceof Error
        ? event.reason.stack
        : undefined;

      reportError({
        message: `Unhandled Promise Rejection: ${message}`,
        source: "promise-rejection",
        stack,
        url: window.location.href,
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

/**
 * Envoie l'erreur au serveur via POST /api/error-report.
 * Ne bloque jamais et échoue silencieusement.
 */
function reportError(data: {
  message: string;
  source?: string;
  stack?: string;
  url?: string;
}) {
  try {
    // Utiliser navigator.sendBeacon si disponible (ne bloque pas la navigation)
    const payload = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/error-report", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/error-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silencieux — ne pas créer d'erreur en essayant de reporter une erreur
  }
}
