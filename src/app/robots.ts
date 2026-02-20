import type { MetadataRoute } from "next";

/** Nécessaire pour l'export statique (output: "export") */
export const dynamic = "force-static";

/**
 * Configuration robots.txt pour le référencement.
 * Autorise l'indexation de toutes les pages et référence le sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.3d-world.online/sitemap.xml",
  };
}
