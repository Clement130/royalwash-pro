import * as React from 'react';

interface AdminNotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}

export const AdminNotificationEmail: React.FC<AdminNotificationEmailProps> = ({
  name,
  email,
  phone,
  service,
  message,
  createdAt,
}) => {
  const formattedDate = new Date(createdAt).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
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
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    padding: '30px 20px',
                    textAlign: 'center',
                  }}>
                    <h1 style={{
                      color: '#ffffff',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}>
                      🎉 Nouveau Lead!
                    </h1>
                    <p style={{
                      color: '#e9d5ff',
                      fontSize: '14px',
                      margin: '8px 0 0 0',
                    }}>
                      {formattedDate}
                    </p>
                  </td>
                </tr>

                {/* Content */}
                <tr>
                  <td style={{ padding: '30px' }}>
                    <h2 style={{
                      color: '#1f2937',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginTop: 0,
                      marginBottom: '20px',
                    }}>
                      Informations du Client
                    </h2>

                    {/* Client Info Table */}
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}>
                      <tr>
                        <td style={{
                          padding: '15px 20px',
                          borderBottom: '1px solid #e5e7eb',
                        }}>
                          <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>
                            👤 Nom:
                          </span>
                        </td>
                        <td style={{
                          padding: '15px 20px',
                          borderBottom: '1px solid #e5e7eb',
                          textAlign: 'right',
                        }}>
                          <span style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>
                            {name}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{
                          padding: '15px 20px',
                          borderBottom: '1px solid #e5e7eb',
                        }}>
                          <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>
                            📧 Email:
                          </span>
                        </td>
                        <td style={{
                          padding: '15px 20px',
                          borderBottom: '1px solid #e5e7eb',
                          textAlign: 'right',
                        }}>
                          <a href={`mailto:${email}`} style={{
                            color: '#2563eb',
                            fontSize: '14px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                          }}>
                            {email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style={{
                          padding: '15px 20px',
                          borderBottom: '1px solid #e5e7eb',
                        }}>
                          <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>
                            📱 Téléphone:
                          </span>
                        </td>
                        <td style={{
                          padding: '15px 20px',
                          borderBottom: '1px solid #e5e7eb',
                          textAlign: 'right',
                        }}>
                          <a href={`tel:${phone}`} style={{
                            color: '#2563eb',
                            fontSize: '14px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                          }}>
                            {phone}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style={{
                          padding: '15px 20px',
                        }}>
                          <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>
                            🚗 Service:
                          </span>
                        </td>
                        <td style={{
                          padding: '15px 20px',
                          textAlign: 'right',
                        }}>
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                          }}>
                            {service}
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Message */}
                    <h3 style={{
                      color: '#1f2937',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginTop: '30px',
                      marginBottom: '15px',
                    }}>
                      💬 Message
                    </h3>
                    <div style={{
                      backgroundColor: '#fffbeb',
                      border: '2px solid #fbbf24',
                      borderRadius: '8px',
                      padding: '20px',
                    }}>
                      <p style={{
                        color: '#78350f',
                        fontSize: '15px',
                        lineHeight: '24px',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {message}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <a href={`mailto:${email}`} style={{
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                        padding: '14px 32px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                      }}>
                        📧 Répondre au client
                      </a>
                    </div>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{
                    backgroundColor: '#f9fafb',
                    padding: '20px',
                    textAlign: 'center',
                    borderTop: '1px solid #e5e7eb',
                  }}>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '13px',
                      margin: 0,
                    }}>
                      Royal Wash Pro - Dashboard Admin
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
};

export default AdminNotificationEmail;
