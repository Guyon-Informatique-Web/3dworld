// Template email : Alerte d'erreur (envoye a l'adresse de surveillance)
// Style rouge d'urgence avec contexte technique complet

import type { ErrorContext } from "@/lib/email";

interface ErrorAlertProps {
  errorMessage: string;
  errorStack?: string;
  context?: ErrorContext;
  timestamp: string;
}

export function ErrorAlert({ errorMessage, errorStack, context, timestamp }: ErrorAlertProps) {
  // Formater le timestamp en heure francaise lisible
  const formattedTime = new Date(timestamp).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Paris",
  });

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "700px", margin: "0 auto", backgroundColor: "#1a1a1a" }}>
      {/* En-tete rouge d'alerte */}
      <div style={{ backgroundColor: "#dc2626", padding: "24px 30px" }}>
        <h1 style={{ color: "#ffffff", margin: 0, fontSize: "20px" }}>ERREUR — 3D World</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "6px 0 0 0", fontSize: "13px" }}>
          {formattedTime}
        </p>
      </div>

      <div style={{ padding: "24px 30px" }}>
        {/* Message d'erreur */}
        <div style={{ backgroundColor: "#2a0000", border: "1px solid #dc2626", borderRadius: "6px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ margin: 0, fontSize: "15px", color: "#fca5a5", fontWeight: 600 }}>
            {errorMessage}
          </p>
        </div>

        {/* Contexte */}
        {context && (
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Contexte
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {context.url && (
                  <tr style={{ borderBottom: "1px solid #333333" }}>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#9ca3af", width: "120px" }}>URL</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#e5e7eb", fontFamily: "monospace" }}>{context.url}</td>
                  </tr>
                )}
                {context.method && (
                  <tr style={{ borderBottom: "1px solid #333333" }}>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#9ca3af" }}>Methode</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#e5e7eb", fontFamily: "monospace" }}>{context.method}</td>
                  </tr>
                )}
                {context.ip && (
                  <tr style={{ borderBottom: "1px solid #333333" }}>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#9ca3af" }}>IP</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#e5e7eb", fontFamily: "monospace" }}>{context.ip}</td>
                  </tr>
                )}
                {context.userAgent && (
                  <tr style={{ borderBottom: "1px solid #333333" }}>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#9ca3af" }}>User-Agent</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#e5e7eb", fontFamily: "monospace", wordBreak: "break-all" }}>{context.userAgent}</td>
                  </tr>
                )}
                {context.additionalInfo && (
                  <tr style={{ borderBottom: "1px solid #333333" }}>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#9ca3af" }}>Info</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "#e5e7eb" }}>{context.additionalInfo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Stack trace */}
        {errorStack && (
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Stack Trace
            </h2>
            <pre style={{
              backgroundColor: "#111111",
              border: "1px solid #333333",
              borderRadius: "6px",
              padding: "16px",
              fontSize: "12px",
              color: "#d1d5db",
              fontFamily: "'Courier New', Courier, monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: "1.5",
              margin: 0,
              overflowX: "auto",
            }}>
              {errorStack}
            </pre>
          </div>
        )}

        {/* Timestamp */}
        <div style={{ borderTop: "1px solid #333333", paddingTop: "12px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Timestamp UTC : {timestamp}
          </p>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{ backgroundColor: "#111111", padding: "16px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
          Alerte automatique — 3D World (guyon-informatique-web.fr)
        </p>
      </div>
    </div>
  );
}
