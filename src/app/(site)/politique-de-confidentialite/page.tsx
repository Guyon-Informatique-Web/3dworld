import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et RGPD du site 3D World - protection de vos données personnelles.",
};

/** Page politique de confidentialité (RGPD) */
export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-24">
      <section className="pt-28 pb-16">
        <SectionTitle
          title="Politique de confidentialité"
          subtitle="Protection de vos données personnelles"
        />
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose prose-gray max-w-none">
            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Responsable du traitement
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les données personnelles collectées sur le site 3D World sont traitées par :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Nom : 3D World</li>
              <li>Email : contact@3dworld.fr</li>
              <li>Téléphone : 01 23 45 67 89</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Données collectées
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les données personnelles suivantes peuvent être collectées lors de votre utilisation du site :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Informations d'identification : nom, prénom, email, téléphone</li>
              <li>Informations d'adresse : adresse postale, code postal, ville</li>
              <li>Historique de vos commandes et transactions</li>
              <li>Données de connexion : adresse IP, cookies, données de navigation</li>
              <li>Informations de paiement (traitées exclusivement par Stripe)</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Finalités du traitement
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Vos données sont utilisées pour les finalités suivantes :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Gestion de votre compte client</li>
              <li>Traitement et suivi de vos commandes</li>
              <li>Envoi d'emails transactionnels (confirmation de commande, suivi de livraison)</li>
              <li>Amélioration du service et de l'expérience utilisateur</li>
              <li>Respect des obligations légales</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Base légale du traitement
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Le traitement de vos données repose sur les bases légales suivantes :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Exécution du contrat (commande, livraison)</li>
              <li>Consentement explicite (pour les communications marketing si applicable)</li>
              <li>Respect des obligations légales (fiscalité, comptabilité)</li>
              <li>Intérêts légitimes (prévention de la fraude, sécurité)</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Destinataires de vos données
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Vos données peuvent être partagées avec les tiers suivants :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Stripe : pour le traitement sécurisé des paiements</li>
              <li>Supabase : pour le stockage de vos données de compte</li>
              <li>Vercel : hébergeur du site</li>
              <li>Resend : pour l'envoi des emails transactionnels</li>
              <li>Autorités publiques : si légalement obligatoire</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Durée de conservation
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Vos données personnelles sont conservées pendant la durée nécessaire à l'exécution du contrat et pour une période additionnelle selon les obligations légales (notamment la prescription civile et les délais de rétention comptables). Les données de compte sont conservées pour 3 ans après la dernière commande. Vous pouvez demander la suppression de votre compte à tout moment.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Droits des utilisateurs
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Droit d'accès
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez demander l'accès à vos données personnelles.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Droit de rectification
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez corriger les informations inexactes ou incomplètes.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Droit à l'oubli
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez demander la suppression de vos données, sauf si une obligation légale nous oblige à les conserver.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Droit à la portabilité
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez demander à recevoir vos données dans un format structuré et portable.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Droit d'opposition
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez vous opposer au traitement de vos données dans certains cas.
            </p>

            <p className="mb-4 text-text-light leading-relaxed">
              Pour exercer ces droits, veuillez contacter contact@3dworld.fr.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Cookies
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Le site 3D World utilise uniquement des cookies essentiels pour le fonctionnement du site. Aucun cookie de tracking ou de marketing n'est utilisé. Les cookies essentiels incluent :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Cookies de session d'authentification (Supabase)</li>
              <li>Cookies de gestion du panier d'achat</li>
            </ul>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez gérer ou désactiver les cookies via les paramètres de votre navigateur. La désactivation des cookies essentiels peut affecter le fonctionnement du site.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Sécurité
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World met en œuvre les mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la destruction, la perte, l'altération, ou l'accès non autorisé. Les informations de paiement sont traitées exclusivement par Stripe, qui garantit le chiffrement SSL et la conformité PCI-DSS.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Contact et réclamation
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Pour toute question concernant la protection de vos données, vous pouvez nous contacter à contact@3dworld.fr. Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) : https://www.cnil.fr
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
