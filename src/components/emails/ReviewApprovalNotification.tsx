// Template email : Notification d'approbation d'avis client
// Utilise des styles inline pour la compatibilite avec les clients mail

interface ReviewApprovalNotificationProps {
  customerName: string;
  productName: string;
  productSlug: string;
  rating: number;
}

export function ReviewApprovalNotification({
  customerName,
  productName,
  productSlug,
  rating,
}: ReviewApprovalNotificationProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const productUrl = `${appUrl}/boutique/${productSlug}`;

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
      {/* En-tete */}
      <div style={{ backgroundColor: "#22c55e", padding: "30px", textAlign: "center" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "24px" }}>3D World</h1>
        <p style={{ color: "#ffffff", margin: "8px 0 0 0", fontSize: "14px" }}>Votre avis a été approuvé !</p>
      </div>

      {/* Corps */}
      <div style={{ padding: "30px" }}>
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "20px" }}>
          Bonjour <strong>{customerName}</strong>,
        </p>
        <p style={{ fontSize: "14px", color: "#555555", marginBottom: "24px" }}>
          Votre avis sur <strong>{productName}</strong> a été approuvé et est maintenant visible pour tous nos clients. Merci d&apos;avoir partagé votre expérience !
        </p>

        {/* Informations avis */}
        <div style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "6px", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666666" }}>
            Votre note : <strong style={{ color: "#22c55e" }}>{"⭐".repeat(rating)}</strong> ({rating}/5)
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666666" }}>
            Produit : <strong>{productName}</strong>
          </p>
        </div>

        {/* Message de remerciement */}
        <p style={{ fontSize: "14px", color: "#555555", marginBottom: "24px" }}>
          Votre avis aide les autres clients à faire le bon choix et nous permet d&apos;améliorer nos produits. Merci de votre confiance !
        </p>

        {/* Bouton CTA */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <a
            href={productUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#22c55e",
              color: "#ffffff",
              padding: "12px 32px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Voir le produit
          </a>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#999999" }}>
          3D World — Impression 3D sur mesure
        </p>
      </div>
    </div>
  );
}
