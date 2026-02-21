import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

/** Page d'accueil du site 3D World */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
