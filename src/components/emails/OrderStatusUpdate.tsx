// Template email : Mise a jour du statut de commande (envoye au client)
// Le titre et le message s'adaptent selon le nouveau statut

import type { EmailOrderData } from "@/lib/email";
import type { OrderStatus } from "@/generated/prisma/client";

interface OrderStatusUpdateProps {
  order: EmailOrderData;
  newStatus: OrderStatus;
}

/** Configuration par statut : titre, message et couleur du bandeau */
const STATUS_CONFIG: Record<string, { title: string; message: string; color: string }> = {
  PROCESSING: {
    title: "Commande en preparation",
    message: "Votre commande est en cours de preparation. Nous mettons tout en oeuvre pour vous la livrer rapidement.",
    color: "#f59e0b",
  },
  SHIPPED: {
    title: "Commande expediee",
    message: "Votre commande a ete expediee et arrivera bientot. Vous recevrez un email des que la livraison sera confirmee.",
    color: "#3b82f6",
  },
  DELIVERED: {
    title: "Commande livree",
    message: "Votre commande a ete livree avec succes. Nous esperons que vos produits vous donneront entiere satisfaction !",
    color: "#22c55e",
  },
  CANCELLED: {
    title: "Commande annulee",
    message: "Votre commande a ete annulee. Si vous n'etes pas a l'origine de cette annulation, veuillez nous contacter.",
    color: "#ef4444",
  },
};

export function OrderStatusUpdate({ order, newStatus }: OrderStatusUpdateProps) {
  const config = STATUS_CONFIG[newStatus] ?? {
    title: "Mise a jour de commande",
    message: `Le statut de votre commande a ete mis a jour : ${newStatus}.`,
    color: "#6b7280",
  };

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
      {/* En-tete avec couleur dynamique */}
      <div style={{ backgroundColor: config.color, padding: "30px", textAlign: "center" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "22px" }}>{config.title}</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.85)", margin: "8px 0 0 0", fontSize: "14px" }}>
          Commande #{shortId}
        </p>
      </div>

      {/* Corps */}
      <div style={{ padding: "30px" }}>
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "16px" }}>
          Bonjour <strong>{order.name}</strong>,
        </p>

        <p style={{ fontSize: "14px", color: "#555555", lineHeight: "1.6", marginBottom: "24px" }}>
          {config.message}
        </p>

        {/* Recap commande */}
        <div style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "6px", marginBottom: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#888888" }}>Numéro de commande</td>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333", fontWeight: 600, textAlign: "right" }}>#{shortId}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#888888" }}>Statut</td>
                <td style={{ padding: "4px 0", fontSize: "14px", fontWeight: 600, textAlign: "right" }}>
                  <span style={{ color: config.color }}>{config.title}</span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#888888" }}>Total</td>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333", fontWeight: 600, textAlign: "right" }}>
                  {Number(order.totalAmount).toFixed(2)} EUR
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Articles */}
        <h3 style={{ fontSize: "15px", color: "#333333", marginBottom: "10px" }}>Articles commandés</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            {order.items.map((item, index) => {
              const itemName = item.variant
                ? `${item.product.name} — ${item.variant.name}`
                : item.product.name;

              return (
                <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "8px 0", fontSize: "14px", color: "#333333" }}>
                    {itemName} <span style={{ color: "#888888" }}>x{item.quantity}</span>
                  </td>
                  <td style={{ padding: "8px 0", fontSize: "14px", color: "#333333", textAlign: "right" }}>
                    {(Number(item.unitPrice) * item.quantity).toFixed(2)} EUR
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Message de contact */}
        <p style={{ fontSize: "13px", color: "#999999", textAlign: "center", marginTop: "16px" }}>
          Une question ? Répondez directement à cet email.
        </p>
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
