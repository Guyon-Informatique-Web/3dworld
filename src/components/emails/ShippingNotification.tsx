// Template email : Notification d'expédition avec numéro de suivi
// Envoye au client quand la commande est expédiée avec un numéro de suivi

import type { EmailOrderData } from "@/lib/email";

interface ShippingNotificationProps {
  order: EmailOrderData;
  trackingNumber: string;
  trackingUrl?: string;
}

export function ShippingNotification({
  order,
  trackingNumber,
  trackingUrl,
}: ShippingNotificationProps) {
  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* En-tete bleu */}
      <div style={{ backgroundColor: "#3b82f6", padding: "30px", textAlign: "center" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "22px" }}>
          Votre commande a été expédiée !
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            margin: "8px 0 0 0",
            fontSize: "14px",
          }}
        >
          Commande #{shortId}
        </p>
      </div>

      {/* Corps */}
      <div style={{ padding: "30px" }}>
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "16px" }}>
          Bonjour <strong>{order.name}</strong>,
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#555555",
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          Bonne nouvelle ! Votre commande a été expédiée et arrivera bientôt. Vous pouvez
          suivre votre colis en utilisant le numéro de suivi ci-dessous.
        </p>

        {/* Section suivi */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "13px", color: "#666666", margin: "0 0 12px 0" }}>
            Numéro de suivi :
          </p>
          <p
            style={{
              fontFamily: "Courier, monospace",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#3b82f6",
              margin: "0 0 16px 0",
              wordBreak: "break-all",
            }}
          >
            {trackingNumber}
          </p>

          {/* Bouton de suivi si URL disponible */}
          {trackingUrl && (
            <a
              href={trackingUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s",
              }}
            >
              Suivre mon colis
            </a>
          )}
        </div>

        {/* Recap commande */}
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ fontSize: "13px", color: "#666666", margin: "0 0 12px 0" }}>
            Récapitulatif de votre commande
          </h3>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "4px 0",
                    fontSize: "13px",
                    color: "#888888",
                  }}
                >
                  Numéro de commande
                </td>
                <td
                  style={{
                    padding: "4px 0",
                    fontSize: "13px",
                    color: "#333333",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  #{shortId}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "4px 0",
                    fontSize: "13px",
                    color: "#888888",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    padding: "4px 0",
                    fontSize: "13px",
                    color: "#333333",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {Number(order.totalAmount).toFixed(2)} EUR
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Articles */}
        <h3 style={{ fontSize: "15px", color: "#333333", marginBottom: "10px" }}>
          Articles commandés
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <tbody>
            {order.items.map((item, index) => {
              const itemName = item.variant
                ? `${item.product.name} — ${item.variant.name}`
                : item.product.name;

              return (
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: "14px",
                      color: "#333333",
                    }}
                  >
                    {itemName}{" "}
                    <span style={{ color: "#888888" }}>x{item.quantity}</span>
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: "14px",
                      color: "#333333",
                      textAlign: "right",
                    }}
                  >
                    {(Number(item.unitPrice) * item.quantity).toFixed(2)} EUR
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Message de contact */}
        <p
          style={{
            fontSize: "13px",
            color: "#999999",
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          Une question ? Répondez directement à cet email.
        </p>
      </div>

      {/* Pied de page */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: "12px", color: "#999999" }}>
          3D World — Impression 3D sur mesure
        </p>
      </div>
    </div>
  );
}
