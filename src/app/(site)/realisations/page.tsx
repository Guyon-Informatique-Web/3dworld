import type { Metadata } from "next";
import RealisationsContent from "@/components/gallery/RealisationsContent";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Galerie de nos réalisations en impression 3D : déco, figurines, prototypes, accessoires et projets sur mesure.",
};

/**
 * Page Réalisations : composant serveur pour exporter les métadonnées SEO.
 * Le contenu interactif (galerie filtrable + lightbox) est délégué au composant client.
 */
export default function RealisationsPage() {
  return <RealisationsContent />;
}
