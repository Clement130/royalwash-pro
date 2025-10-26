import * as React from 'react';

interface ClientConfirmationEmailProps {
  name: string;
  service: string;
}

export const ClientConfirmationEmail: React.FC<ClientConfirmationEmailProps> = ({
  name,
  service,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f3f4f6',
      margin: 0,
      padding: 0,
    }}>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f3f4f6', padding: '40px 0' }}>
        <tr>
          <td align="center">
            <table width="600" cellPadding="0" cellSpacing="0" style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              {/* Header */}
              <tr>
                <td style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  padding: '40px 20px',
                  textAlign: 'center',
                }}>
                  <h1 style={{
                    color: '#ffffff',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}>
                    Royal Wash Pro
                  </h1>
                  <p style={{
                    color: '#bfdbfe',
                    fontSize: '16px',
                    margin: '10px 0 0 0',
                  }}>
                    L'excellence du lavage automobile
                  </p>
                </td>
              </tr>

              {/* Content */}
              <tr>
                <td style={{ padding: '40px 30px' }}>
                  <h2 style={{
                    color: '#1f2937',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}>
                    Merci {name}!
                  </h2>

                  <p style={{
                    color: '#4b5563',
                    fontSize: '16px',
                    lineHeight: '24px',
                    margin: '0 0 20px 0',
                  }}>
                    Nous avons bien reçu votre demande pour notre service <strong>{service}</strong>.
                  </p>

                  <p style={{
                    color: '#4b5563',
                    fontSize: '16px',
                    lineHeight: '24px',
                    margin: '0 0 20px 0',
                  }}>
                    Notre équipe va vous contacter très prochainement pour confirmer votre rendez-vous et répondre à toutes vos questions.
                  </p>

                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '20px',
                    margin: '30px 0',
                  }}>
                    <h3 style={{
                      color: '#1e40af',
                      fontSize: '18px',
                      margin: '0 0 10px 0',
                    }}>
                      📞 Besoin de nous joindre rapidement?
                    </h3>
                    <p style={{
                      color: '#1e3a8a',
                      fontSize: '14px',
                      margin: 0,
                      lineHeight: '22px',
                    }}>
                      Téléphone: <strong>+33 X XX XX XX XX</strong><br />
                      Email: <strong>contact@royalwashpro.com</strong><br />
                      Horaires: Lun-Sam 8h-19h, Dim 9h-17h
                    </p>
                  </div>

                  <p style={{
                    color: '#4b5563',
                    fontSize: '16px',
                    lineHeight: '24px',
                    margin: '20px 0 0 0',
                  }}>
                    À très bientôt,<br />
                    <strong>L'équipe Royal Wash Pro</strong>
                  </p>
                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td style={{
                  backgroundColor: '#f9fafb',
                  padding: '30px',
                  textAlign: 'center',
                  borderTop: '1px solid #e5e7eb',
                }}>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    margin: '0 0 10px 0',
                  }}>
                    Royal Wash Pro - Marseille, France
                  </p>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '12px',
                    margin: 0,
                  }}>
                    © 2025 Royal Wash Pro. Tous droits réservés.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
);

export default ClientConfirmationEmail;
