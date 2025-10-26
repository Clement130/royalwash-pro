/**
 * Email Templates pour Royal Wash Pro
 * 
 * Ce fichier contient tous les templates HTML pour les emails automatiques.
 * Les templates sont conçus pour être responsive et professionnels.
 * 
 * Utilisation:
 * - clientConfirmationTemplate: Envoyé au client après soumission du formulaire
 * - adminNotificationTemplate: Envoyé à l'admin pour notification instantanée
 */

interface ClientTemplateData {
  name: string;
  service: string;
  message: string;
  leadId: string;
}

interface AdminTemplateData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
}

/**
 * Template de confirmation envoyé au client
 * Design professionnel avec branding Royal Wash Pro
 * Objectif: Rassurer le client et confirmer la réception de sa demande
 */
export const clientConfirmationTemplate = (data: ClientTemplateData): string => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de votre demande - Royal Wash Pro</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 32px;
        font-weight: 700;
      }
      .header p {
        margin: 0;
        font-size: 16px;
        opacity: 0.9;
      }
      .content {
        background: #f9fafb;
        padding: 40px 30px;
      }
      .content p {
        margin: 0 0 15px 0;
      }
      .content strong {
        color: #1E40AF;
      }
      .service-badge {
        display: inline-block;
        background-color: #F59E0B;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        margin: 10px 0;
      }
      .message-box {
        background-color: #e5e7eb;
        border-left: 4px solid #1E40AF;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .lead-id {
        font-family: 'Courier New', monospace;
        background-color: #1f2937;
        color: #10b981;
        padding: 12px;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        margin: 20px 0;
      }
      .cta-button {
        display: inline-block;
        background-color: #F59E0B;
        color: white;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 6px;
        font-weight: 600;
        margin: 20px 0;
        transition: background-color 0.3s;
      }
      .footer {
        text-align: center;
        padding: 30px;
        background-color: #1f2937;
        color: #9ca3af;
        font-size: 12px;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #60a5fa;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 0;
          border-radius: 0;
        }
        .header, .content, .footer {
          padding: 25px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🚗 Royal Wash Pro</h1>
        <p>Lavage Auto Premium à Domicile</p>
      </div>
      <div class="content">
        <p style="font-size: 18px; font-weight: 600; color: #1E40AF; margin-bottom: 20px;">
          ✅ Demande bien reçue !
        </p>
        
        <p>Bonjour <strong>${data.name}</strong>,</p>
        
        <p>Nous avons bien reçu votre demande de lavage auto et nous vous en remercions !</p>
        
        <p>Vous avez sélectionné la formule :</p>
        <span class="service-badge">${getServiceDisplayName(data.service)}</span>
        
        <div class="message-box">
          <strong>Votre message :</strong><br>
          "${data.message}"
        </div>
        
        <p><strong>Prochaines étapes :</strong></p>
        <p>Notre équipe va prendre contact avec vous dans les <strong>24 heures</strong> pour :</p>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li>Confirmer votre rendez-vous</li>
          <li>Préciser les détails de l'intervention</li>
          <li>Répondre à toutes vos questions</li>
        </ul>
        
        <p style="margin-top: 25px;">Votre numéro de demande :</p>
        <div class="lead-id">${data.leadId}</div>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          💡 <em>Astuce : En attendant notre appel, préparez votre véhicule en retirant les objets personnels de l'intérieur pour optimiser la qualité du lavage.</em>
        </p>
      </div>
      
      <div class="footer">
        <p><strong>Royal Wash Pro</strong></p>
        <p>Lavage Auto Premium à Domicile • Zone Istres et environs</p>
        <p style="margin-top: 15px;">
          <a href="mailto:contact@royalwashpro.com">contact@royalwashpro.com</a> • 
          <a href="tel:+33612345678">06 12 34 56 78</a>
        </p>
        <p style="margin-top: 10px; color: #6b7280; font-size: 11px;">
          Vous recevez cet email car vous avez effectué une demande sur notre site.<br>
          Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.
        </p>
      </div>
    </div>
  </body>
</html>
`;

/**
 * Fonction utilitaire pour afficher le nom complet du service
 */
function getServiceDisplayName(service: string): string {
  const serviceNames: { [key: string]: string } = {
    'essentielle': 'Essentielle (25€) - Lavage Express',
    'premium': 'Premium (45€) - Lavage Complet',
    'vip': 'VIP (75€) - Lavage Royal',
    'autre': 'Autre - Service personnalisé'
  };
  return serviceNames[service] || service;
}

/**
 * Template de notification pour l'administrateur
 * Design type terminal/hacker pour démarquer des emails standards
 * Objectif: Notification instantanée avec toutes les infos en un coup d'œil
 */
export const adminNotificationTemplate = (data: AdminTemplateData): string => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚨 NOUVEAU LEAD - Royal Wash Pro</title>
    <style>
      body {
        font-family: 'Courier New', 'Consolas', monospace;
        background-color: #0a0a0a;
        color: #00ff00;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 700px;
        margin: 0 auto;
        border: 2px solid #00ff00;
        border-radius: 8px;
        overflow: hidden;
      }
      .alert {
        background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .header {
        background-color: #1a1a1a;
        padding: 20px;
        border-bottom: 2px solid #00ff00;
      }
      .data-section {
        background-color: #0f0f0f;
        padding: 20px;
        margin: 0;
      }
      .data-row {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #1a3a1a;
      }
      .data-label {
        width: 180px;
        color: #888;
        flex-shrink: 0;
      }
      .data-value {
        color: #00ff00;
        flex: 1;
        word-break: break-word;
      }
      .highlight {
        color: #ffff00;
        font-weight: bold;
      }
      .service-badge {
        display: inline-block;
        padding: 5px 12px;
        border-radius: 4px;
        font-weight: bold;
        margin-left: 10px;
      }
      .service-essentielle { background-color: #3b82f6; color: white; }
      .service-premium { background-color: #8b5cf6; color: white; }
      .service-vip { background-color: #f59e0b; color: white; }
      .cta-section {
        background-color: #1a1a1a;
        padding: 25px;
        text-align: center;
        border-top: 2px solid #00ff00;
      }
      .cta-button {
        display: inline-block;
        background-color: #00ff00;
        color: #0a0a0a;
        text-decoration: none;
        padding: 15px 40px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
        margin: 10px;
        transition: all 0.3s;
      }
      .cta-button:hover {
        background-color: #00cc00;
        transform: scale(1.05);
      }
      .footer {
        background-color: #050505;
        color: #666;
        padding: 15px;
        text-align: center;
        font-size: 11px;
      }
      .message-content {
        background-color: #1a1a1a;
        padding: 15px;
        margin: 15px 0;
        border-left: 4px solid #00ff00;
        color: #cccccc;
        font-style: italic;
        white-space: pre-wrap;
      }
      @media only screen and (max-width: 600px) {
        body { padding: 10px; }
        .data-row { flex-direction: column; }
        .data-label { width: 100%; margin-bottom: 5px; }
        .cta-button { display: block; margin: 10px 0; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="alert">
        🚨 NOUVEAU LEAD REÇU
      </div>
      
      <div class="header">
        <p style="margin: 0; font-size: 14px; color: #888;">
          &gt; system.notification.new_lead --timestamp=${new Date(data.timestamp).toISOString()}
        </p>
        <p style="margin: 10px 0 0 0; font-size: 18px;">
          &gt; <span class="highlight">ACTION REQUISE DANS LES 24H</span>
        </p>
      </div>
      
      <div class="data-section">
        <div class="data-row">
          <div class="data-label">👤 CLIENT:</div>
          <div class="data-value">
            <span class="highlight">${data.name}</span>
          </div>
        </div>
        
        <div class="data-row">
          <div class="data-label">📧 EMAIL:</div>
          <div class="data-value">
            <a href="mailto:${data.email}" style="color: #00ff00; text-decoration: underline;">
              ${data.email}
            </a>
          </div>
        </div>
        
        <div class="data-row">
          <div class="data-label">📱 TÉLÉPHONE:</div>
          <div class="data-value">
            <a href="tel:${data.phone}" style="color: #00ff00; text-decoration: underline;">
              ${data.phone}
            </a>
          </div>
        </div>
        
        <div class="data-row">
          <div class="data-label">💎 SERVICE:</div>
          <div class="data-value">
            ${getServiceDisplayName(data.service)}
            <span class="service-badge service-${data.service}">
              ${getServicePrice(data.service)}
            </span>
          </div>
        </div>
        
        <div class="data-row">
          <div class="data-label">⏰ REÇU LE:</div>
          <div class="data-value">
            ${formatDateTimeFr(data.timestamp)}
          </div>
        </div>
        
        <div class="data-row" style="border-bottom: none;">
          <div class="data-label">💬 MESSAGE:</div>
          <div class="data-value"></div>
        </div>
        <div class="message-content">
${data.message}
        </div>
      </div>
      
      <div class="cta-section">
        <p style="margin: 0 0 20px 0; color: #00ff00;">
          &gt; ACTIONS DISPONIBLES
        </p>
        <a href="tel:${data.phone}" class="cta-button">
          📞 APPELER MAINTENANT
        </a>
        <a href="mailto:${data.email}" class="cta-button">
          📧 ENVOYER EMAIL
        </a>
        <a href="http://localhost:3000/admin" class="cta-button" style="background-color: #3b82f6; color: white;">
          📊 VOIR DASHBOARD
        </a>
      </div>
      
      <div class="footer">
        <p style="margin: 5px 0;">Royal Wash Pro - Admin Dashboard</p>
        <p style="margin: 5px 0;">Notification automatique générée par le système</p>
        <p style="margin: 5px 0;">Pour modifier vos préférences de notification, contactez le support technique</p>
      </div>
    </div>
  </body>
</html>
`;

/**
 * Fonction utilitaire pour obtenir le prix du service
 */
function getServicePrice(service: string): string {
  const prices: { [key: string]: string } = {
    'essentielle': '25€',
    'premium': '45€',
    'vip': '75€',
    'autre': 'Sur devis'
  };
  return prices[service] || 'N/A';
}

/**
 * Fonction utilitaire pour formater la date et l'heure en français
 */
function formatDateTimeFr(timestamp: string): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options);
}
