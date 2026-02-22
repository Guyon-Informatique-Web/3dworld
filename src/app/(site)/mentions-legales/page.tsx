import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site 3D World - informations sur l'éditeur et l'hébergeur.",
};

/** Page mentions légales */
export default function MentionsLegalesPage() {
  return (
    <div className="pt-24">
      <section className="pt-28 pb-16">
        <SectionTitle
          title="Mentions légales"
          subtitle="Informations légales et administratives"
        />
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose prose-gray max-w-none">
            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Éditeur du site
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Le site 3D World est édité par :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Nom : 3D World</li>
              <li>Email : contact@3dworld.fr</li>
              <li>Téléphone : 01 23 45 67 89</li>
              <li>Localisation : France</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Hébergeur du site
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Ce site est hébergé par :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Vercel Inc</li>
              <li>Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
              <li>Site : https://vercel.com</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Propriété intellectuelle
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Tous les éléments de ce site (textes, images, logos, graphismes, codes source) sont la propriété exclusive de 3D World ou utilisés avec autorisation. Toute reproduction, distribution, transmission ou utilisation non autorisée de ces contenus est strictement interdite, sauf dans les cas prévus par la loi.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Crédits et réalisation
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Ce site a été créé et est maintenu par :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Guyon Informatique & Web</li>
              <li>Site : https://guyon-informatique-web.fr</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Limitation de responsabilité
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World s'efforce de maintenir ce site à jour et de corriger les erreurs qui pourraient s'y glisser. Cependant, 3D World ne garantit pas l'exactitude, la complétude ou la pertinence des informations contenues dans ce site. 3D World ne peut être responsable des dommages directs ou indirects résultant de l'accès à ce site ou de l'utilisation des informations qu'il contient.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Modification des conditions
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World se réserve le droit de modifier ces mentions légales à tout moment sans préavis. Il vous est recommandé de consulter régulièrement cette page pour vous tenir informé de toute modification.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-text-light">
                Dernière mise à jour : février 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
