import type { Metadata } from "next";
import ServiceDetail from "@/components/services/ServiceDetail";
import ProcessSteps from "@/components/services/ProcessSteps";
import MaterialsList from "@/components/services/MaterialsList";

export const metadata: Metadata = {
  title: "Nos services - 3D World",
  description:
    "Découvrez nos services d'impression 3D sur commande : PLA, PETG, ABS, TPU, Résine. De l'idée à l'objet fini, nous donnons forme à vos projets.",
};

/** Page Services : détail des prestations, processus et matériaux */
export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* Section 1 : Impression sur commande */}
      <ServiceDetail
        title="Impression 3D sur commande"
        description="De l'idée à l'objet, nous donnons forme à vos projets. Envoyez-nous votre fichier 3D ou décrivez simplement votre besoin : nous nous occupons du reste avec des matériaux de qualité professionnelle."
        features={[
          "Impression de fichiers STL, OBJ, 3MF",
          "Choix parmi 5 matériaux différents",
          "Contrôle qualité systématique",
          "Délais de fabrication rapides",
          "Conseils personnalisés gratuits",
        ]}
        imageSide="right"
        ctaText="Demander un devis"
        ctaHref="/contact"
      />

      {/* Processus en 4 étapes */}
      <ProcessSteps />

      {/* Grille des matériaux */}
      <MaterialsList />

      {/* Section 2 : Nos créations */}
      <ServiceDetail
        title="Nos créations"
        description="Explorez notre collection d'objets imprimés en 3D. De la décoration aux figurines en passant par les accessoires pratiques, trouvez l'inspiration ou commandez directement depuis notre catalogue."
        features={[
          "Objets décoratifs uniques",
          "Figurines et miniatures détaillées",
          "Accessoires pratiques du quotidien",
          "Pièces personnalisables sur demande",
        ]}
        imageSide="left"
        ctaText="Voir la galerie"
        ctaHref="/realisations"
      />
    </div>
  );
}
