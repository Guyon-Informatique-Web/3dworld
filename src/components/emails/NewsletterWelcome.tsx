// Template email : Bienvenue newsletter
// Utilise des styles inline pour la compatibilite avec les clients mail

interface NewsletterWelcomeProps {
  email: string;
}

export function NewsletterWelcome({ email }: NewsletterWelcomeProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const shopUrl = `${appUrl}/boutique`;

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
      {/* En-tete */}
      <div style={{ backgroundColor: "#3b82f6", padding: "30px", textAlign: "center" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "24px" }}>3D World</h1>
        <p style={{ color: "#ffffff", margin: "8px 0 0 0", fontSize: "14px" }}>Bienvenue dans la newsletter !</p>
      </div>

      {/* Corps */}
      <div style={{ padding: "30px" }}>
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "20px" }}>
          Bienvenue !
        </p>
        <p style={{ fontSize: "14px", color: "#555555", marginBottom: "24px" }}>
          Vous êtes maintenant inscrit(e) à la newsletter <strong>3D World</strong>. Vous recevrez nos dernières actualités, promotions et nouveaux produits directement dans votre boîte mail.
        </p>

        {/* Informations */}
        <div style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "6px", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666666" }}>
            Adresse inscrite : <strong>{email}</strong>
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#888888" }}>
            Vous recevrez nos mises à jour régulièrement. Vous pouvez vous désabonner à tout moment.
          </p>
        </div>

        {/* Message de presentation */}
        <p style={{ fontSize: "14px", color: "#555555", marginBottom: "24px" }}>
          Explorez notre gamme complète de produits en impression 3D et découvrez les solutions sur mesure que nous proposons pour vos projets.
        </p>

        {/* Bouton CTA */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <a
            href={shopUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              padding: "12px 32px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Découvrir la boutique
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
