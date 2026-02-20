import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact - 3D World",
  description:
    "Contactez 3D World pour vos projets d'impression 3D. Devis gratuit et sans engagement.",
};

/** Page Contact : formulaire de devis + informations de contact */
export default function ContactPage() {
  return (
    <div className="pt-24">
      <SectionTitle
        title="Contactez-nous"
        subtitle="Parlons de votre projet"
      />

      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Formulaire de devis (2 colonnes sur desktop) */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Informations de contact (1 colonne sur desktop) */}
        <div>
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}
