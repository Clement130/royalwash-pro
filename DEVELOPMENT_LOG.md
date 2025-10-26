# Royal Wash Pro - Journal de Développement

## Statut Actuel du Projet
Date dernière mise à jour : 26 octobre 2025, 13:56

### ✅ Fonctionnalités Implémentées (Phase 1 - Automatisation de base)

#### 1. API de Contact Automatisée
**Fichier créé** : `/src/app/api/contact/route.ts`

**Fonctionnalités** :
- Endpoint POST qui reçoit les soumissions du formulaire de contact
- Validation complète des données (champs obligatoires, format email)
- Sauvegarde automatique dans un fichier JSON local (`leads.json` à la racine du projet)
- Génération d'ID unique pour chaque lead avec timestamp ISO
- Endpoint GET pour récupérer tous les leads (utilisé par le dashboard admin)
- Gestion d'erreurs complète avec messages explicites

**Structure de données Lead** :
```typescript
{
  id: string,           // Format: "lead-{timestamp}-{random}"
  name: string,
  email: string,
  phone: string,
  service: string,      // "essentielle" | "premium" | "vip" | "autre"
  message: string,
  timestamp: string     // ISO 8601 format
}
```

**TODO Phase 2** : Implémenter l'envoi d'emails automatiques via Resend API
- Email de confirmation au client
- Email de notification à l'administrateur
- Variables d'environnement à configurer : `RESEND_API_KEY`

#### 2. Formulaire de Contact Amélioré
**Fichier modifié** : `/src/app/page.tsx`

**Améliorations** :
- Appel API asynchrone au lieu de simple alert()
- État de chargement pendant la soumission (`isSubmitting`)
- État de résultat avec type (success/error) et message
- Affichage visuel du statut avec icônes et couleurs appropriées
- Désactivation du bouton pendant l'envoi pour éviter doubles soumissions
- Réinitialisation automatique du formulaire après succès
- Gestion complète des erreurs réseau

**Expérience utilisateur** :
- Bouton change de "Envoyer la demande" à "Envoi en cours..."
- Message de succès vert avec checkmark après soumission réussie
- Message d'erreur rouge avec icône d'alerte en cas de problème
- Formulaire vidé automatiquement après succès

#### 3. Dashboard Administrateur
**Fichier créé** : `/src/app/admin/page.tsx`

**Fonctionnalités** :
- Vue d'ensemble avec 5 KPIs en cards :
  * Total Leads (nombre total de demandes)
  * Leads par formule (Essentielle, Premium, VIP)
  * Chiffre d'affaires potentiel calculé automatiquement
- Barre de recherche (nom, email, téléphone)
- Filtre par service- Bouton d'actualisation manuelle
- Tableau complet avec toutes les demandes triées par date (plus récent en premier)
- Calcul automatique du CA potentiel par formule et total
- Interface responsive et moderne avec Tailwind CSS

**URL d'accès** : `http://localhost:3000/admin`

**TODO Phase 2** : Ajouter authentification (mot de passe simple ou Supabase Auth)

---

## 🔧 Architecture Technique

### Stack Technologique Utilisé
- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript (strict mode)
- **Styling** : Tailwind CSS
- **Stockage** : Fichier JSON local (sans base de données pour Phase 1)
- **Déploiement prévu** : Vercel (gratuit)

### Structure des Fichiers Créés/Modifiés

```
royalwash-pro/
├── src/
│   ├── app/
│   │   ├── page.tsx                    [MODIFIÉ] - Formulaire amélioré
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts            [CRÉÉ] - API de gestion des leads
│   │   └── admin/
│   │       └── page.tsx                [CRÉÉ] - Dashboard administrateur
├── leads.json                           [AUTO-GÉNÉRÉ] - Base de données des leads
└── DEVELOPMENT_LOG.md                   [CRÉÉ] - Ce fichier
```

### Stockage des Données

**Format actuel** : `leads.json` (racine du projet)
```json
[
  {
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "phone": "0612345678",
    "service": "premium",
    "message": "Je souhaite un lavage complet pour ma BMW Série 3. Disponible samedi prochain.",
    "timestamp": "2025-10-26T12:56:00.000Z",
    "id": "lead-1729947360000-abc123xyz"
  }
]
```

**Avantages** :
- Pas de configuration de base de données
- Facile à sauvegarder (copier le fichier)
- Lisible et éditable manuellement si besoin
- Coût zéro

**Limitations** :
- Pas de recherche avancée optimisée
- Peut devenir lent avec >10000 leads (non critique pour début d'activité)
- Pas de sauvegarde automatique (faire backup manuel régulier)

**Migration future vers Supabase (Phase 3)** : 
Quand le volume augmente, migration simple vers Supabase PostgreSQL gratuit (500MB, 50000 requêtes/mois)

---

## 📋 Prochaines Étapes Prioritaires

### Phase 2 : Automatisation Emails (Urgence : HAUTE)

#### A. Configuration Resend pour Emails Automatiques

**Pourquoi Resend** :
- 3000 emails/mois gratuits (largement suffisant pour démarrer)
- API ultra-simple
- Templates HTML natifs avec React
- Excellent délivrabilité

**Étapes d'implémentation** :

1. **Créer compte Resend** : https://resend.com/signup
   - S'inscrire avec email
   - Vérifier domaine (ou utiliser leur domaine test onboarding.resend.dev)
   - Copier API key

2. **Configurer variables d'environnement**
   Créer/modifier `.env.local` à la racine :
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
   RESEND_FROM_EMAIL=contact@royalwashpro.com  # ou onboarding@resend.dev pour tests
   RESEND_TO_EMAIL=votre-email@gmail.com        # votre email perso pour notifications
   ```

3. **Installer package Resend**
   ```bash
   cd C:\Users\cleme\Documents\royalwash-pro
   npm install resend
   ```

4. **Créer templates d'emails**
   
   Fichier à créer : `/src/lib/email-templates.ts`
   ```typescript
   // Template confirmation client
   export const clientConfirmationTemplate = (data: {
     name: string;
     service: string;
     message: string;
     leadId: string;
   }) => `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <style>
           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
           .header { background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); 
                     color: white; padding: 30px; text-align: center; }
           .content { background: #f9fafb; padding: 30px; }
           .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
         </style>
       </head>
       <body>
         <div class="container">
           <div class="header">
             <h1>Royal Wash Pro</h1>
             <p>Confirmation de votre demande</p>
           </div>
           <div class="content">
             <p>Bonjour ${data.name},</p>
             <p>Nous avons bien reçu votre demande de <strong>${data.service}</strong>.</p>
             <p><strong>Votre message :</strong><br>${data.message}</p>
             <p>Nous vous contacterons dans les 24 heures pour confirmer votre rendez-vous.</p>
             <p>Numéro de demande : ${data.leadId}</p>
           </div>
           <div class="footer">
             <p>Royal Wash Pro - Lavage Auto Premium</p>
             <p>Marseille, France | contact@royalwashpro.com</p>
           </div>
         </div>
       </body>
     </html>
   `;

   // Template notification admin
   export const adminNotificationTemplate = (data: {
     name: string;
     email: string;
     phone: string;
     service: string;
     message: string;
     timestamp: string;
   }) => `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <style>
           body { font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px; }
           .alert { background: #ff4444; color: white; padding: 10px; margin-bottom: 20px; }
           .data { background: #2a2a2a; padding: 15px; margin: 10px 0; }
         </style>
       </head>
       <body>
         <div class="alert">🔔 NOUVEAU LEAD REÇU !</div>
         <div class="data">
           <p><strong>Nom :</strong> ${data.name}</p>
           <p><strong>Email :</strong> ${data.email}</p>
           <p><strong>Téléphone :</strong> ${data.phone}</p>
           <p><strong>Service :</strong> ${data.service}</p>
           <p><strong>Message :</strong> ${data.message}</p>
           <p><strong>Reçu le :</strong> ${new Date(data.timestamp).toLocaleString('fr-FR')}</p>
         </div>
         <p>👉 Accédez au dashboard : http://localhost:3000/admin</p>
       </body>
     </html>
   `;
   ```

5. **Modifier l'API route.ts pour intégrer Resend**

   Dans `/src/app/api/contact/route.ts`, remplacer la fonction `sendEmailNotification` :

   ```typescript
   import { Resend } from 'resend';
   import { clientConfirmationTemplate, adminNotificationTemplate } from '@/lib/email-templates';

   const resend = new Resend(process.env.RESEND_API_KEY);

   async function sendEmailNotification(data: ContactFormData) {
     try {
       // Email de confirmation au client
       await resend.emails.send({
         from: process.env.RESEND_FROM_EMAIL!,
         to: data.email,
         subject: 'Confirmation de votre demande - Royal Wash Pro',
         html: clientConfirmationTemplate({
           name: data.name,
           service: data.service,
           message: data.message,
           leadId: data.id
         })
       });

       // Email de notification à l'admin
       await resend.emails.send({
         from: process.env.RESEND_FROM_EMAIL!,
         to: process.env.RESEND_TO_EMAIL!,
         subject: `🚗 Nouveau lead : ${data.name} - ${data.service}`,
         html: adminNotificationTemplate(data)
       });

       console.log('✅ Emails envoyés avec succès');
       return true;
     } catch (error) {
       console.error('❌ Erreur envoi emails:', error);
       return false;
       // On ne bloque pas la création du lead même si l'email échoue
     }
   }
   ```

**Test après implémentation** :
- Soumettre le formulaire sur localhost:3000
- Vérifier réception des 2 emails (client + admin)
- Si emails n'arrivent pas : vérifier spam, vérifier API key, vérifier logs console

---

### Phase 3 : Système de Réservation avec Créneaux (Urgence : MOYENNE)

**Objectif** : Éliminer totalement l'intervention humaine en permettant au client de choisir directement son créneau et payer en ligne.

#### A. Gestion des Disponibilités

**Base de données des créneaux** :
Ajouter dans `leads.json` ou créer nouveau fichier `availability.json` :

```json
{
  "workingHours": {
    "monday": { "start": "08:00", "end": "19:00", "enabled": true },
    "tuesday": { "start": "08:00", "end": "19:00", "enabled": true },
    "wednesday": { "start": "08:00", "end": "19:00", "enabled": true },
    "thursday": { "start": "08:00", "end": "19:00", "enabled": true },
    "friday": { "start": "08:00", "end": "19:00", "enabled": true },
    "saturday": { "start": "08:00", "end": "19:00", "enabled": true },
    "sunday": { "start": "09:00", "end": "17:00", "enabled": true }
  },
  "slotDuration": 90,
  "blockedDates": [],
  "bookedSlots": [
    {
      "date": "2025-10-27",
      "time": "10:00",
      "duration": 90,
      "bookingId": "lead-xxx"
    }
  ]
}
```

**Logique d'affichage** :
- Générer créneaux disponibles pour les 30 prochains jours
- Exclure les créneaux déjà réservés
- Afficher dans un calendrier interactif (utiliser react-calendar ou shadcn/ui Calendar)

#### B. Intégration Stripe pour Paiement

**Pourquoi Stripe** :
- Standard industrie pour paiements en ligne
- Mode test gratuit et illimité
- Pas de frais mensuels, seulement 1.5% + 0.25€ par transaction réussie
- Checkout pré-construit (pas besoin de coder interface paiement)

**Étapes d'implémentation** :

1. **Créer compte Stripe** : https://dashboard.stripe.com/register
   - Mode test activé par défaut
   - Copier clés API test (commencent par `pk_test_` et `sk_test_`)

2. **Configurer variables d'environnement**
   Ajouter dans `.env.local` :
   ```env
   STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx  # après config webhook
   NEXT_PUBLIC_SITE_URL=http://localhost:3000     # ou votre domaine en prod
   ```

3. **Installer packages Stripe**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

4. **Créer API route pour Checkout**

   Fichier à créer : `/src/app/api/checkout/route.ts`
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import Stripe from 'stripe';

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2024-10-28.acacia'
   });

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       const { 
         formula,      // "essentielle" | "premium" | "vip"
         date,         // "2025-10-27"
         time,         // "10:00"
         name,
         email,
         phone,
         message 
       } = body;

       // Map formulas to prices
       const prices: { [key: string]: number } = {
         essentielle: 2500, // 25€ en centimes
         premium: 4500,     // 45€
         vip: 7500          // 75€
       };

       const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [
           {
             price_data: {
               currency: 'eur',
               product_data: {
                 name: `Royal Wash Pro - Formule ${formula}`,
                 description: `Rendez-vous le ${date} à ${time}`,
               },
               unit_amount: prices[formula],
             },
             quantity: 1,
           },
         ],
         mode: 'payment',
         success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/#tarifs`,
         customer_email: email,
         metadata: {
           formula,
           date,
           time,
           name,
           phone,
           message,
         },
       });

       return NextResponse.json({ sessionId: session.id, url: session.url });
     } catch (error) {
       console.error('Stripe error:', error);
       return NextResponse.json(
         { error: 'Erreur lors de la création de la session de paiement' },
         { status: 500 }
       );
     }
   }
   ```

5. **Créer page de réservation avec calendrier**

   Fichier à créer : `/src/app/reserver/page.tsx`
   - Étape 1 : Sélection formule (cards avec les 3 options)
   - Étape 2 : Choix date/heure (calendrier interactif)
   - Étape 3 : Coordonnées (nom, email, téléphone, message)
   - Étape 4 : Récapitulatif + bouton "Payer maintenant"
   - Au clic sur "Payer", redirection vers Stripe Checkout

6. **Créer webhook Stripe pour confirmer paiement**

   Fichier à créer : `/src/app/api/webhooks/stripe/route.ts`
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import Stripe from 'stripe';
   import { writeFile, readFile } from 'fs/promises';
   import { existsSync } from 'fs';
   import path from 'path';

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

   export async function POST(request: NextRequest) {
     const body = await request.text();
     const sig = request.headers.get('stripe-signature')!;

     let event: Stripe.Event;

     try {
       event = stripe.webhooks.constructEvent(
         body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET!
       );
     } catch (err) {
       return NextResponse.json(
         { error: 'Webhook signature verification failed' },
         { status: 400 }
       );
     }

     if (event.type === 'checkout.session.completed') {
       const session = event.data.object as Stripe.Checkout.Session;

       // Créer la réservation confirmée
       const booking = {
         id: `booking-${Date.now()}`,
         ...session.metadata,
         status: 'confirmed',
         paidAt: new Date().toISOString(),
         stripeSessionId: session.id,
         amount: session.amount_total! / 100, // Convertir centimes en euros
       };

       // Sauvegarder dans bookings.json
       const bookingsPath = path.join(process.cwd(), 'bookings.json');
       let bookings = [];
       if (existsSync(bookingsPath)) {
         bookings = JSON.parse(await readFile(bookingsPath, 'utf-8'));
       }
       bookings.push(booking);
       await writeFile(bookingsPath, JSON.stringify(bookings, null, 2));

       // Marquer le créneau comme réservé dans availability.json
       // TODO: implémenter logique de blocage de créneau

       // Envoyer email de confirmation (avec Resend)
       // TODO: implémenter avec templates dédiés

       console.log('✅ Réservation confirmée:', booking.id);
     }

     return NextResponse.json({ received: true });
   }
   ```

7. **Tester le flux complet**
   - Utiliser carte test Stripe : `4242 4242 4242 4242`, date future, CVC quelconque
   - Vérifier redirection vers page confirmation
   - Vérifier création dans bookings.json
   - Vérifier réception emails

---

### Phase 4 : Optimisations et Scale (Urgence : BASSE)

**À implémenter quand le business décolle** :

- Migration vers Supabase (base de données PostgreSQL gratuite)
- Authentification admin avec Supabase Auth
- SMS de confirmation via Twilio (gratuit jusqu'à 15€ de crédit)
- Programme de fidélité avec points et réductions
- Gestion multi-opérateurs (si vous embauchez)
- Application mobile (React Native) pour notifications push
- Analytics avancé avec PostHog (heatmaps, session replay)
- A/B testing sur formulaire et pricing
- SEO avancé (blog, backlinks, Google My Business)

---

## 🐛 Problèmes Connus et Solutions

### 1. Le fichier leads.json n'existe pas au démarrage
**Solution** : L'API le crée automatiquement à la première soumission. Rien à faire.

### 2. Erreur CORS sur l'API
**Symptôme** : `CORS policy: No 'Access-Control-Allow-Origin' header`
**Solution** : Next.js gère automatiquement CORS pour les API routes. Si le problème persiste, ajouter dans `next.config.ts` :
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

### 3. Le dashboard admin est vide alors que des leads existent
**Solution** : Vérifier que `leads.json` est bien à la racine du projet (pas dans `/src`). Vérifier la console navigateur pour erreurs API.

### 4. Emails Resend ne sont pas reçus
**Checklist** :
- ✅ API key valide dans `.env.local`
- ✅ Adresse email `from` vérifiée sur Resend (ou utiliser `onboarding@resend.dev`)
- ✅ Vérifier dossier spam
- ✅ Vérifier logs Resend dashboard : https://resend.com/emails
- ✅ Vérifier console serveur Next.js pour erreurs

---

## 📊 Métriques de Succès Actuelles

**État au 26/10/2025 :**
- ✅ Système de capture leads : OPÉRATIONNEL
- ✅ Dashboard admin : OPÉRATIONNEL  
- ✅ Validation formulaire : OPÉRATIONNEL
- ⏳ Emails automatiques : EN ATTENTE (Phase 2)
- ⏳ Paiement en ligne : EN ATTENTE (Phase 3)
- ⏳ Calendrier réservation : EN ATTENTE (Phase 3)

**Premiers résultats** :
- Total leads capturés : 1
- Taux conversion formulaire : 100% (1/1 soumissions réussies)
- CA potentiel : 45€

---

## 🔑 Informations Importantes pour Continuité

### Variables d'Environnement Requises
```env
# À configurer pour Phase 2
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@royalwashpro.com
RESEND_TO_EMAIL=votre-email@gmail.com

# À configurer pour Phase 3
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Commandes Utiles
```bash
# Démarrer le serveur de développement
cd C:\Users\cleme\Documents\royalwash-pro
npm run dev

# Accéder au site
# Homepage : http://localhost:3000
# Admin : http://localhost:3000/admin

# Voir les leads capturés
cat leads.json

# Sauvegarder le projet sur GitHub
git add .
git commit -m "Phase 1: Automated lead capture system"
git push origin main
```

### Fichiers Critiques à NE PAS Modifier Sans Précaution
- `leads.json` - Base de données des leads (backup régulièrement !)
- `bookings.json` - Réservations payées (sera créé en Phase 3)
- `.env.local` - Secrets API (NE JAMAIS commit sur Git)

---

## 📞 Contact et Support

**Développé par** : Claude (Assistant IA Anthropic)  
**Pour** : Clément - Propriétaire Royal Wash Pro  
**Contexte** : Business automatisé avec interactions sociales minimales  
**Stack** : Next.js 15 + TypeScript + Tailwind CSS + Resend + Stripe

**Pour reprendre le développement dans une nouvelle conversation** :
1. Mentionner : "Je travaille sur Royal Wash Pro, consulte DEVELOPMENT_LOG.md"
2. Spécifier la phase souhaitée (Phase 2 = emails, Phase 3 = paiement)
3. Le nouveau Claude aura toutes les infos nécessaires dans ce fichier

---

**Dernière mise à jour** : 26 octobre 2025, 14:10  
**Version** : 1.0.0-phase1  
**Statut** : Système de base opérationnel, prêt pour Phase 2
