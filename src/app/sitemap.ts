import type { MetadataRoute } from "next";

/** Nécessaire pour l'export statique (output: "export") */
export const dynamic = "force-static";

/**
 * Sitemap pour le référencement sur les moteurs de recherche.
 * Génère automatiquement /sitemap.xml avec toutes les routes publiques.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.3d-world.online";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/boutique`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/realisations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
