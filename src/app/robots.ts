import type { MetadataRoute } from "next";

/** Nécessaire pour l'export statique (output: "export") */
export const dynamic = "force-static";

/**
 * Configuration robots.txt pour le référencement.
 * Autorise l'indexation de toutes les pages publiques et référence le sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.3d-world.online";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/mon-compte/", "/panier/", "/favoris/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
