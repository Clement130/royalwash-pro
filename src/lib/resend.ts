import { Resend } from 'resend';

// Initialiser Resend avec la clé API
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email de l'administrateur (à configurer dans .env.local)
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@royalwashpro.com';

// Email "from" (doit être vérifié dans Resend)
export const FROM_EMAIL = process.env.FROM_EMAIL || 'Royal Wash Pro <onboarding@resend.dev>';
