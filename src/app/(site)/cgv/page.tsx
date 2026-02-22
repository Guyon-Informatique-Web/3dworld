import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente du site 3D World - e-commerce d'impression 3D.",
};

/** Page conditions générales de vente */
export default function CGVPage() {
  return (
    <div className="pt-24">
      <section className="pt-28 pb-16">
        <SectionTitle
          title="Conditions générales de vente"
          subtitle="Conditions d'achat et de livraison"
        />
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose prose-gray max-w-none">
            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Objet et champ d'application
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les présentes conditions générales de vente (CGV) s'appliquent à toutes les commandes passées sur le site 3D World. Elles définissent les droits et obligations du client et du site lors d'une transaction. L'accès au site implique l'acceptation complète de ces conditions.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Produits et descriptions
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World propose la vente en ligne d'objets imprimés en 3D (figurines, décoration, accessoires, prototypes, etc.). Les produits sont décrits avec le plus de précision possible. Les photographies du site sont à titre illustratif. Des variations mineures de couleur, texture ou finition peuvent survenir en raison du processus de fabrication artisanale.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Prix
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les prix sont affichés en euros TTC (toutes taxes comprises). Ils incluent la TVA applicable. 3D World se réserve le droit de modifier les prix sans préavis, mais les prix en vigueur au moment de la commande seront appliqués aux clients ayant déjà passé une commande.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Commande et validation
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Pour commander, le client doit être majeur et créer un compte sur le site. Le client doit remplir le formulaire de commande avec des informations exactes et complètes. La commande est validée par le client après vérification des produits et des frais de livraison. Un email de confirmation de commande est envoyé au client.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Paiement
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Le paiement s'effectue par carte bancaire via le service sécurisé Stripe. Les données bancaires ne sont pas stockées sur nos serveurs. Le paiement doit être effectué immédiatement après la validation de la commande. La commande n'est validée que lors de la confirmation du paiement par Stripe. En cas de problème de paiement, veuillez contacter contact@3dworld.fr.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Livraison
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les livraisons s'effectuent en France métropolitaine. Les délais de livraison sont indicatifs et comptés à partir de la confirmation du paiement. Ils ne constituent pas un engagement ferme. Les frais de port sont précisés avant la validation de la commande et sont à la charge du client. 3D World ne peut être responsable des retards causés par le transporteur.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Délais indicatifs
            </h3>
            <ul className="mb-4 list-disc pl-6 text-text-light space-y-1">
              <li>Préparation : 2 à 5 jours ouvrables</li>
              <li>Livraison : 3 à 7 jours ouvrables selon la région</li>
            </ul>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Droit de rétractation
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Conformément à la directive européenne, le client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier sa décision ni à supporter de frais, à l'exception des frais de renvoi.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Exceptions au droit de rétractation
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Le droit de rétractation ne s'applique pas aux produits sur mesure ou personnalisés ainsi qu'aux produits ayant subi une modification importante après la vente.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Exercer le droit de rétractation
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              Pour exercer ce droit, le client doit notifier 3D World par email à contact@3dworld.fr dans les 14 jours. Le produit doit être retourné en bon état et dans son emballage d'origine. Une fois le retour reçu et inspecté, un remboursement sera effectué dans les 30 jours.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Garanties légales
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World garantit que les produits sont conformes aux descriptions et exempt de défauts de fabrication. La garantie légale de conformité s'applique automatiquement et couvre les défauts présents au moment de la livraison. En cas de non-conformité, le client doit contacter 3D World dans les 2 mois suivant la découverte du défaut.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Responsabilité
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              3D World ne peut être responsable des dommages indirects, pertes de données, ou interruptions de service. La responsabilité de 3D World est limitée au montant de la commande concernée.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Protection des données
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les données personnelles collectées lors de vos achats sont traitées conformément à notre politique de confidentialité. Veuillez consulter notre politique de confidentialité pour plus d'informations.
            </p>

            <h2 className="mt-10 mb-4 text-2xl font-bold text-text">
              Droit applicable et litiges
            </h2>
            <p className="mb-4 text-text-light leading-relaxed">
              Les présentes CGV sont régies par la loi française. Tout litige découlant de l'interprétation ou de l'exécution de ces conditions sera soumis à la juridiction des tribunaux français. Avant tout action contentieuse, le client s'engage à rechercher un règlement amiable en contactant 3D World à contact@3dworld.fr.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-text">
              Médiation
            </h3>
            <p className="mb-4 text-text-light leading-relaxed">
              En cas de litige, le consommateur peut saisir gratuitement un médiateur de la consommation. Le médiateur peut être contacté via le site du Centre Français de Médiation e-Commerce ou au travers de notre email contact@3dworld.fr.
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
