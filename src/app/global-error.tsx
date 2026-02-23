"use client";

// Global error boundary Next.js — capture les erreurs de rendu React
// Affiche une page d'erreur et envoie l'alerte au serveur

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reporter l'erreur au serveur
    try {
      fetch("/api/error-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          source: "global-error-boundary",
          stack: error.stack,
          url: window.location.href,
        }),
      }).catch(() => {});
    } catch {
      // Silencieux
    }
  }, [error]);

  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Une erreur est survenue
          </h1>
          <p className="text-gray-600 mb-8">
            Nous avons été notifiés et travaillons à résoudre le problème.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
