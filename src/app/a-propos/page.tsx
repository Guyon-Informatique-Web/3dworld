import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import StorySection from "@/components/about/StorySection";
import StatsSection from "@/components/about/StatsSection";
import EquipmentSection from "@/components/about/EquipmentSection";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire de 3D World, notre équipement et notre passion pour l'impression 3D.",
};

/** Page À propos : histoire, statistiques et équipement */
export default function AProposPage() {
  return (
    <div className="pt-24">
      <SectionTitle
        title="À propos de 3D World"
        subtitle="Notre passion, votre imagination"
      />
      <StorySection />
      <StatsSection />
      <EquipmentSection />
    </div>
  );
}
