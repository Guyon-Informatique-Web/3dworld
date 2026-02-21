// Template email : Notification nouvelle commande (envoye a l'admin)
// Contient toutes les informations detaillees + lien vers le dashboard

import type { EmailOrderData } from "@/lib/email";

interface NewOrderNotificationProps {
  order: EmailOrderData;
  appUrl: string;
}

export function NewOrderNotification({ order, appUrl }: NewOrderNotificationProps) {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const shippingLabel = order.shippingMethod === "PICKUP" ? "Retrait en magasin" : "Livraison a domicile";
  const dashboardUrl = `${appUrl}/admin/commandes/${order.id}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
      {/* En-tete */}
      <div style={{ backgroundColor: "#0d6efd", padding: "24px 30px" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "20px" }}>Nouvelle commande recue</h1>
        <p style={{ color: "#cce0ff", margin: "6px 0 0 0", fontSize: "14px" }}>
          Commande #{shortId} — {orderDate}
        </p>
      </div>

      <div style={{ padding: "24px 30px" }}>
        {/* Infos client */}
        <h2 style={{ fontSize: "16px", color: "#333333", marginBottom: "12px", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
          Client
        </h2>
        <table style={{ width: "100%", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "14px", color: "#888888", width: "120px" }}>Nom</td>
              <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333", fontWeight: 600 }}>{order.name}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "14px", color: "#888888" }}>Email</td>
              <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333" }}>
                <a href={`mailto:${order.email}`} style={{ color: "#0d6efd" }}>{order.email}</a>
              </td>
            </tr>
            {order.phone && (
              <tr>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#888888" }}>Telephone</td>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333" }}>{order.phone}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Articles */}
        <h2 style={{ fontSize: "16px", color: "#333333", marginBottom: "12px", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
          Articles commandes
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ textAlign: "left", padding: "8px", fontSize: "13px", color: "#666666" }}>Article</th>
              <th style={{ textAlign: "center", padding: "8px", fontSize: "13px", color: "#666666" }}>Qte</th>
              <th style={{ textAlign: "right", padding: "8px", fontSize: "13px", color: "#666666" }}>P.U.</th>
              <th style={{ textAlign: "right", padding: "8px", fontSize: "13px", color: "#666666" }}>Total</th>
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
                  <td style={{ padding: "8px", fontSize: "14px", color: "#333333" }}>{itemName}</td>
                  <td style={{ padding: "8px", fontSize: "14px", color: "#555555", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "8px", fontSize: "14px", color: "#555555", textAlign: "right" }}>{Number(item.unitPrice).toFixed(2)} EUR</td>
                  <td style={{ padding: "8px", fontSize: "14px", color: "#333333", textAlign: "right", fontWeight: 600 }}>{lineTotal.toFixed(2)} EUR</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Montants */}
        <div style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", borderRadius: "6px", marginBottom: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#666666" }}>Sous-total</td>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333", textAlign: "right" }}>
                  {(Number(order.totalAmount) - Number(order.shippingCost)).toFixed(2)} EUR
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#666666" }}>Livraison</td>
                <td style={{ padding: "4px 0", fontSize: "14px", color: "#333333", textAlign: "right" }}>
                  {Number(order.shippingCost) === 0 ? "Gratuit" : `${Number(order.shippingCost).toFixed(2)} EUR`}
                </td>
              </tr>
              <tr style={{ borderTop: "1px solid #dee2e6" }}>
                <td style={{ padding: "8px 0 4px 0", fontSize: "16px", fontWeight: 700, color: "#1a1a2e" }}>Total</td>
                <td style={{ padding: "8px 0 4px 0", fontSize: "16px", fontWeight: 700, color: "#1a1a2e", textAlign: "right" }}>
                  {Number(order.totalAmount).toFixed(2)} EUR
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Livraison */}
        <h2 style={{ fontSize: "16px", color: "#333333", marginBottom: "12px", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
          Livraison
        </h2>
        <p style={{ fontSize: "14px", color: "#555555", margin: "0 0 6px 0" }}>
          <strong>Mode :</strong> {shippingLabel}
        </p>
        {order.shippingAddress && (
          <p style={{ fontSize: "14px", color: "#555555", margin: "0 0 6px 0", whiteSpace: "pre-line" }}>
            <strong>Adresse :</strong> {order.shippingAddress}
          </p>
        )}

        {/* Bouton vers le dashboard */}
        <div style={{ textAlign: "center", margin: "28px 0 12px 0" }}>
          <a
            href={dashboardUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#0d6efd",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Voir la commande dans le dashboard
          </a>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "16px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#999999" }}>
          Notification automatique — 3D World Admin
        </p>
      </div>
    </div>
  );
}
