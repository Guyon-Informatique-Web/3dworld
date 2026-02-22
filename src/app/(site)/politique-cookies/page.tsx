import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de cookies du site 3D World - informations sur l'utilisation des cookies.",
};

/** Page politique de cookies */
export default function PolitiqueCookiesPage() {
  return (
    <div className="pt-24">
      <section className="pt-28 pb-16">
        <SectionTitle
          title="Politique de cookies"
          subtitle="Transparence sur l'utilisation des cookies"
        />
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose prose-gray max-w-none">
            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Qu'est-ce qu'un cookie ?
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, smartphone, tablette) lors de votre navigation sur Internet. Il permet au site de mémoriser certaines informations sur votre visite et d'améliorer votre expérience utilisateur. Les cookies sont envoyés au navigateur et stockés localement.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Types de cookies utilisés par 3D World
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Le site 3D World n'utilise que des cookies essentiels au fonctionnement. Aucun cookie de tracking, publicitaire ou de marketing tiers n'est utilisé.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Cookies essentiels
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Ces cookies sont nécessaires au fonctionnement normal du site. Ils permettent :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>
                <strong>Authentification (Supabase Auth)</strong> : maintient votre session de connexion et vous identifie lors de la navigation
              </li>
              <li>
                <strong>Panier d'achat</strong> : mémorise les produits que vous avez ajoutés au panier avant le paiement
              </li>
              <li>
                <strong>Préférences d'affichage</strong> : mémorise vos préférences de langue ou de thème
              </li>
            </ul>
            <p className="mb-4 text-text-light leading-relaxed">
              Ces cookies n'ont aucun but de suivi ou d'analyse. Ils expirent à la fin de votre session ou après un délai défini (généralement quelques semaines ou mois).
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Cookies non utilisés
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World ne recourt PAS à :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Cookies de tracking ou d'analyse (Google Analytics, Hotjar, etc.)</li>
              <li>Cookies publicitaires ou de remarketing (Facebook Pixel, Google Ads, etc.)</li>
              <li>Cookies de tiers</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Données collectées par les tiers
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Bien que 3D World n'utilise pas de cookies de tracking, certaines données anonymes peuvent être collectées par les prestataires suivants :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>
                <strong>Vercel (hébergeur)</strong> : collecte des données de serveur (logs d'accès, adresse IP anonymisée) pour la maintenance et la sécurité
              </li>
              <li>
                <strong>Stripe (paiements)</strong> : collecte des données de transaction pour la détection de fraude et la conformité réglementaire
              </li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Comment gérer les cookies
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Vous pouvez contrôler les cookies via les paramètres de votre navigateur. La plupart des navigateurs vous permettent de :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Afficher les cookies stockés</li>
              <li>Supprimer les cookies existants</li>
              <li>Désactiver automatiquement les cookies</li>
              <li>Accepter ou refuser les cookies par site</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Accéder aux paramètres des cookies
            </h3>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>
                <strong>Google Chrome</strong> : Paramètres &gt; Confidentialité et sécurité &gt; Cookies
              </li>
              <li>
                <strong>Firefox</strong> : Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de site
              </li>
              <li>
                <strong>Safari</strong> : Préférences &gt; Confidentialité &gt; Gérer les données de site
              </li>
              <li>
                <strong>Edge</strong> : Paramètres &gt; Confidentialité &gt; Cookies
              </li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Impact de la désactivation des cookies
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              La désactivation des cookies essentiels peut affecter le fonctionnement du site :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Vous ne pourrez pas rester connecté</li>
              <li>Votre panier d'achat ne sera pas sauvegardé</li>
              <li>Les préférences d'affichage ne seront pas mémorisées</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Do Not Track
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Votre navigateur peut envoyer un signal "Do Not Track" (DNT). 3D World respecte ce signal en ne déployant pas de cookies de suivi supplémentaires.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Modifications de cette politique
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World se réserve le droit de modifier cette politique de cookies à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Contact
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Pour toute question concernant les cookies ou cette politique, veuillez contacter :
            </p>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Email : contact@3dworld.fr</li>
              <li>Téléphone : 01 23 45 67 89</li>
            </ul>

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
