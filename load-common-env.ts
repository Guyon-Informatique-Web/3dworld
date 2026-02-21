// Charge les variables d'environnement depuis le fichier commun clients/.env.local
// Les variables préfixées 3DWORLD_ sont mappées vers leur nom standard
// Les variables partagées (sans préfixe projet) sont chargées telles quelles
// Les variables déjà définies (par le .env local du projet) ne sont PAS écrasées

import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "dotenv";

const PROJECT_PREFIX = "3DWORLD_";
const ALL_PREFIXES = ["3DWORLD_"];

const publicEnvVars: Record<string, string> = {};

try {
  const commonEnvPath = resolve(process.cwd(), "..", ".env.local");
  const content = readFileSync(commonEnvPath, "utf-8");
  const parsed = parse(content);

  for (const [key, value] of Object.entries(parsed)) {
    let targetKey: string | null = null;

    if (key.startsWith(PROJECT_PREFIX)) {
      // 3DWORLD_DATABASE_URL -> DATABASE_URL
      targetKey = key.slice(PROJECT_PREFIX.length);
    } else if (!ALL_PREFIXES.some((p) => key.startsWith(p))) {
      // Variable partagée (STRIPE_SECRET_KEY, RESEND_API_KEY, etc.)
      targetKey = key;
    }
    // Les variables d'autres projets sont ignorées

    if (targetKey && value) {
      if (!process.env[targetKey]) {
        process.env[targetKey] = value;
      }
      if (targetKey.startsWith("NEXT_PUBLIC_")) {
        publicEnvVars[targetKey] = process.env[targetKey]!;
      }
    }
  }
} catch {
  // Fichier commun introuvable (Vercel, etc.) — on continue avec les .env injectées
}

// Sur Vercel, les NEXT_PUBLIC_* sont dans process.env directement
// On les expose aussi via publicEnvVars pour next.config.ts
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("NEXT_PUBLIC_") && value && !publicEnvVars[key]) {
    publicEnvVars[key] = value;
  }
}

// Export pour next.config.ts (expose les NEXT_PUBLIC_ au client)
export { publicEnvVars };
