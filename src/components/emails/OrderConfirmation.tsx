// Template email : Confirmation de commande (envoye au client)
// Utilise des styles inline pour la compatibilite avec les clients mail

import type { EmailOrderData } from "@/lib/email";

interface OrderConfirmationProps {
  order: EmailOrderData;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  // Calcul du sous-total (total - frais de livraison)
  const subtotal = Number(order.totalAmount) - Number(order.shippingCost);
  const shortId = order.id.slice(0, 8).toUpperCase();
  const shippingLabel = order.shippingMethod === "PICKUP" ? "Retrait en magasin" : "Livraison a domicile";

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
      {/* En-tete */}
      <div style={{ backgroundColor: "#1a1a2e", padding: "30px", textAlign: "center" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "24px" }}>3D World</h1>
        <p style={{ color: "#a0a0c0", margin: "8px 0 0 0", fontSize: "14px" }}>Confirmation de commande</p>
      </div>

      {/* Corps */}
      <div style={{ padding: "30px" }}>
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "20px" }}>
          Bonjour <strong>{order.name}</strong>,
        </p>
        <p style={{ fontSize: "14px", color: "#555555", marginBottom: "24px" }}>
          Merci pour votre commande chez 3D World ! Voici le recapitulatif de votre achat.
        </p>

        {/* Numero de commande */}
        <div style={{ backgroundColor: "#f5f5f5", padding: "12px 16px", borderRadius: "6px", marginBottom: "24px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#666666" }}>
            Commande <strong style={{ color: "#1a1a2e" }}>#{shortId}</strong>
          </p>
        </div>

        {/* Tableau des articles */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontSize: "13px", color: "#888888", fontWeight: 600 }}>Article</th>
              <th style={{ textAlign: "center", padding: "8px 0", fontSize: "13px", color: "#888888", fontWeight: 600 }}>Qte</th>
              <th style={{ textAlign: "right", padding: "8px 0", fontSize: "13px", color: "#888888", fontWeight: 600 }}>Prix</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => {
              const itemName = item.variant
                ? `${item.product.name} — ${item.variant.name}`
                : item.product.name;
              const lineTotal = Number(item.unitPrice) * item.quantity;

              return (
                <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "#333333" }}>{itemName}</td>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "#555555", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "#333333", textAlign: "right" }}>{lineTotal.toFixed(2)} EUR</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totaux */}
        <div style={{ borderTop: "2px solid #e0e0e0", paddingTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "14px", color: "#666666" }}>Sous-total</span>
            <span style={{ fontSize: "14px", color: "#333333" }}>{subtotal.toFixed(2)} EUR</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "14px", color: "#666666" }}>Frais de livraison</span>
            <span style={{ fontSize: "14px", color: "#333333" }}>
              {Number(order.shippingCost) === 0 ? "Gratuit" : `${Number(order.shippingCost).toFixed(2)} EUR`}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #e0e0e0" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e" }}>Total</span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e" }}>{Number(order.totalAmount).toFixed(2)} EUR</span>
          </div>
        </div>

        {/* Infos livraison */}
        <div style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "6px", marginTop: "24px" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 600, color: "#333333" }}>
            Mode de livraison
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "#555555" }}>{shippingLabel}</p>
          {order.shippingAddress && (
            <>
              <p style={{ margin: "12px 0 6px 0", fontSize: "14px", fontWeight: 600, color: "#333333" }}>
                Adresse de livraison
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#555555", whiteSpace: "pre-line" }}>
                {order.shippingAddress}
              </p>
            </>
          )}
        </div>

        {/* Message de remerciement */}
        <p style={{ fontSize: "14px", color: "#555555", marginTop: "24px", textAlign: "center" }}>
          Merci pour votre commande chez <strong>3D World</strong> !<br />
          Nous vous tiendrons informe de l&apos;avancement de votre commande.
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
