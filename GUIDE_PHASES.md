# 📖 Guide de Développement - Royal Wash Pro

Ce guide décompose le projet en phases atomiques, chacune réalisable en une seule conversation avec Claude. Chaque phase est indépendante et peut être attaquée dans l'ordre ou dans le désordre selon les priorités business.

---

## 🎯 PHASE 1 : Système de Base [COMPLÉTÉ ✅]

**Objectif** : Capturer les leads via un formulaire et les afficher dans un dashboard admin.

**Temps estimé** : 3-4 heures  
**Complexité** : Facile  
**Faisable en 1 conversation** : Oui ✅

### Composants développés
1. Formulaire de contact avec validation (nom, email, téléphone, service, message)
2. API POST `/api/contact` pour sauvegarder dans `leads.json`
3. API GET `/api/contact` pour récupérer tous les leads
4. Dashboard admin sur `/admin` avec KPIs et tableau de leads
5. Recherche et filtrage dans le dashboard

### Fichiers créés
- `/src/app/api/contact/route.ts` - API de gestion des leads
- `/src/app/admin/page.tsx` - Dashboard administrateur
- `/src/app/page.tsx` - Homepage avec formulaire (modifié)

### Données stockées
- Format : Fichier JSON local (`leads.json` à la racine)
- Structure : Array d'objets avec id, name, email, phone, service, message, timestamp

### Tests à faire
- Soumettre le formulaire → Lead apparaît dans `leads.json`
- Ouvrir `/admin` → Lead apparaît dans le tableau
- Rechercher un lead → Filtrage fonctionne
- Filtrer par service → Affichage correct

### Statut : Phase terminée et fonctionnelle

---

## 📧 PHASE 2 : Emails Automatiques [CODE COMPLET ✅ / CONFIG MANUELLE ⏳]

**Objectif** : Envoyer automatiquement deux emails à chaque nouveau lead (confirmation client + notification admin).

**Temps estimé** : 3-4 heures de développement + 5 minutes de configuration manuelle  
**Complexité** : Moyenne  
**Faisable en 1 conversation** : Oui ✅ (code uniquement)

### Composants développés
1. Package Resend installé (`npm install resend`)
2. Templates HTML professionnels pour deux types d'emails
3. Fonction d'envoi automatique dans l'API `/api/contact`
4. Gestion d'erreurs robuste (lead sauvegardé même si email échoue)
5. Guide de configuration détaillé

### Fichiers créés
- `/src/lib/email-templates.ts` - Templates HTML complets
- `.env.example` - Template de configuration
- `RESEND_SETUP_GUIDE.md` - Guide pas-à-pas de configuration

### Fichiers modifiés
- `/src/app/api/contact/route.ts` - Intégration Resend

### Configuration manuelle requise (5 minutes)
Cette étape ne peut pas être automatisée car elle nécessite :
1. Créer un compte sur https://resend.com/signup
2. Récupérer la clé API dans le dashboard Resend
3. Créer le fichier `.env.local` avec les 3 variables :
   ```env
   RESEND_API_KEY=ta_cle_copiee_depuis_resend
   RESEND_FROM_EMAIL=onboarding@resend.dev
   RESEND_TO_EMAIL=ton.email@gmail.com
   ```
4. Redémarrer le serveur Next.js
5. Tester en soumettant le formulaire

### Tests à faire (après configuration)
- Soumettre le formulaire → Deux emails reçus (client + admin)
- Vérifier inbox et spam → Emails bien arrivés
- Dashboard Resend → Statut "Delivered" visible
- Logs serveur → "✅ Emails envoyés avec succès"

### Statut : Code terminé, configuration manuelle en attente

**Note importante** : Cette phase peut être sautée temporairement. Le système de capture de leads fonctionne parfaitement sans les emails. Tu peux passer à la Phase 3 et revenir configurer Resend plus tard si tu veux.

---

## 💳 PHASE 3 : Réservation + Paiement Stripe [PROCHAINE PHASE]

**Objectif** : Permettre aux clients de réserver un créneau et de payer en ligne via Stripe, éliminant complètement les no-shows et les relances de paiement.

**Temps estimé** : 4-6 heures  
**Complexité** : Moyenne-Élevée  
**Faisable en 1 conversation** : Oui ✅ (avec concentration)

### Sous-phases atomiques (peuvent être faites séparément si nécessaire)

#### 3.1 : Gestion des disponibilités (1-2h)
**Objectif** : Créer un système pour définir et gérer les créneaux horaires disponibles.

**Fichiers à créer** :
- `/availability.json` - Base de données des créneaux et réservations
  ```json
  {
    "workingHours": {
      "monday": { "start": "08:00", "end": "19:00", "enabled": true },
      ...
    },
    "slotDuration": 90,
    "blockedDates": [],
    "bookedSlots": []
  }
  ```
- `/src/lib/availability.ts` - Fonctions utilitaires :
  - `getAvailableSlots(date)` - Retourne créneaux libres pour une date
  - `isSlotAvailable(date, time)` - Vérifie si créneau libre
  - `bookSlot(date, time, bookingId)` - Réserve un créneau
  - `releaseSlot(bookingId)` - Libère un créneau (annulation)

**Logique** :
1. Définir horaires de travail par jour de la semaine
2. Générer créneaux disponibles (ex: 08:00, 09:30, 11:00, etc.)
3. Exclure créneaux déjà réservés
4. Exclure dates bloquées manuellement (jours fériés, congés)
5. Retourner seulement créneaux libres pour les 30 prochains jours

**Tests** :
- Fonction retourne bien des créneaux
- Créneaux réservés sont exclus
- Horaires respectés (pas de créneau avant 08:00 ou après 19:00)

#### 3.2 : Interface de réservation (2-3h)
**Objectif** : Créer un tunnel de réservation en plusieurs étapes.

**Page à créer** : `/src/app/reserver/page.tsx`

**Structure du tunnel** :
1. **Étape 1 : Sélection formule**
   - Cards des 3 formules (Essentielle, Premium, VIP)
   - Badge "Plus populaire" sur Premium
   - Prix et features visibles
   - Bouton "Choisir cette formule"

2. **Étape 2 : Choix date et heure**
   - Calendrier interactif (react-calendar ou shadcn/ui)
   - Désactivation des dates sans créneaux disponibles
   - Affichage des heures disponibles pour la date sélectionnée
   - Sélection du créneau par boutons cliquables

3. **Étape 3 : Coordonnées**
   - Champs : Nom, Email, Téléphone, Adresse, Code postal, Ville
   - Auto-complétion adresse (Google Places API optionnel)
   - Validation zone géographique (rayon 30km depuis Istres)
   - Champs optionnels : Modèle véhicule, Instructions spéciales

4. **Étape 4 : Récapitulatif et paiement**
   - Résumé de la réservation (formule, date, heure, prix)
   - Bouton "Payer maintenant" → Redirection Stripe Checkout
   - Mentions légales et CGV (checkboxes)

**Composants à développer** :
- `<BookingWizard>` - Composant principal avec gestion des étapes
- `<FormulaSelector>` - Sélection de la formule
- `<DateTimePicker>` - Calendrier + heures disponibles
- `<CustomerInfoForm>` - Formulaire de coordonnées
- `<BookingSummary>` - Récapitulatif avant paiement
- `<ProgressBar>` - Indicateur de progression (Étape X/4)

**État global à gérer** (useState ou Context) :
```typescript
{
  formula: 'premium',
  date: '2025-10-27',
  time: '10:00',
  customerInfo: {
    name, email, phone, address, city, postalCode
  },
  carModel?: string,
  specialInstructions?: string
}
```

**Tests** :
- Navigation entre étapes fonctionne
- Données persistées entre étapes
- Validation empêche de passer à l'étape suivante si erreur
- Bouton "Précédent" permet de revenir modifier

#### 3.3 : Intégration Stripe (1-2h)
**Objectif** : Configurer Stripe et gérer le flux de paiement.

**Configuration Stripe (5 minutes, similaire à Resend)** :
1. Créer compte sur https://dashboard.stripe.com/register
2. Récupérer les clés API test (pk_test_ et sk_test_)
3. Ajouter dans `.env.local` :
   ```env
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

**Installation package** :
```bash
npm install stripe @stripe/stripe-js
```

**API route à créer** : `/src/app/api/checkout/route.ts`
- Fonction POST qui crée une Stripe Checkout Session
- Paramètres : formula, date, time, customerInfo
- Métadonnées : Toutes les infos de réservation à sauvegarder après paiement
- Retour : URL de redirection vers Stripe

**Code exemple** :
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: `Lavage ${formula}`,
        description: `Réservation ${date} à ${time}`
      },
      unit_amount: priceInCents[formula]
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reserver`,
  customer_email: customerInfo.email,
  metadata: { formula, date, time, ...customerInfo }
});
```

**Webhook à créer** : `/src/app/api/webhooks/stripe/route.ts`
- Écoute l'événement `checkout.session.completed`
- Récupère les métadonnées de la session
- Crée la réservation confirmée dans `bookings.json`
- Bloque le créneau dans `availability.json`
- Envoie email de confirmation (si Resend configuré)

**Tests** :
- Checkout redirige vers Stripe correctement
- Carte test (4242 4242 4242 4242) fonctionne
- Webhook reçoit bien l'événement après paiement
- Réservation créée dans `bookings.json`
- Créneau marqué comme réservé

#### 3.4 : Page de confirmation (30min-1h)
**Objectif** : Afficher la confirmation de réservation après paiement.

**Page à créer** : `/src/app/confirmation/[id]/page.tsx` (route dynamique)

**Contenu** :
- Message de succès avec animation (confetti ou checkmark)
- Récapitulatif complet de la réservation :
  - Numéro de réservation unique
  - Formule choisie et prix payé
  - Date et heure du rendez-vous
  - Adresse où se rendre
  - Coordonnées du client
- QR code de confirmation (généré avec qrcode.js)
- Boutons d'action :
  - Ajouter au calendrier (fichier .ics téléchargeable)
  - Imprimer la confirmation
  - Retour à l'accueil
- Instructions de préparation du véhicule

**Fichiers à créer** :
- Page de confirmation
- `/src/lib/calendar.ts` - Génération fichier .ics pour calendrier
- `/src/lib/qrcode.ts` - Génération QR code

**Tests** :
- Page affiche bien les bonnes informations
- QR code scanne correctement vers la page de confirmation
- Fichier .ics s'ajoute bien au calendrier (Google, Apple, Outlook)

### Structure finale des données

**Fichier `bookings.json`** (créé automatiquement) :
```json
[
  {
    "id": "booking-1729947360000-abc123",
    "customerId": "lead-...",
    "formula": "premium",
    "price": 45.00,
    "bookingDate": "2025-10-27",
    "bookingTime": "10:00",
    "durationMinutes": 90,
    "status": "confirmed",
    "customerInfo": {
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "0612345678",
      "address": "123 rue Example",
      "city": "Istres",
      "postalCode": "13800"
    },
    "carModel": "BMW Série 3",
    "specialInstructions": "Portail code 1234",
    "stripeSessionId": "cs_test_...",
    "stripePaymentIntentId": "pi_...",
    "paidAt": "2025-10-26T15:30:00.000Z",
    "createdAt": "2025-10-26T15:30:00.000Z"
  }
]
```

### Fichiers créés/modifiés en Phase 3

**Nouveaux fichiers** :
- `/availability.json` - Configuration créneaux et réservations
- `/bookings.json` - Réservations payées (auto-généré)
- `/src/lib/availability.ts` - Logique de disponibilité
- `/src/lib/calendar.ts` - Génération .ics
- `/src/lib/qrcode.ts` - Génération QR codes
- `/src/app/reserver/page.tsx` - Interface de réservation
- `/src/app/confirmation/[id]/page.tsx` - Page de confirmation
- `/src/app/api/checkout/route.ts` - API Stripe Checkout
- `/src/app/api/webhooks/stripe/route.ts` - Webhook Stripe

**Packages à installer** :
```bash
npm install stripe @stripe/stripe-js
npm install react-calendar
npm install qrcode @types/qrcode
npm install ics
```

### Tests complets de la Phase 3

1. **Test complet du tunnel** :
   - Ouvrir `/reserver`
   - Sélectionner formule Premium
   - Choisir date J+3 et créneau 10:00
   - Remplir coordonnées
   - Payer avec carte test Stripe
   - Vérifier redirection vers page confirmation
   - Vérifier que créneau est maintenant indisponible

2. **Test création réservation** :
   - Vérifier `bookings.json` contient la nouvelle réservation
   - Vérifier `availability.json` a le créneau marqué comme réservé
   - Vérifier email de confirmation reçu (si Resend configuré)

3. **Test dashboard admin** :
   - Accéder `/admin`
   - Vérifier que la réservation payée apparaît
   - Vérifier KPIs mis à jour (CA, réservations)

4. **Test annulation** (si implémenté) :
   - Annuler la réservation
   - Vérifier remboursement Stripe
   - Vérifier créneau libéré

### Statut : En attente de développement

---

## 📱 PHASE 4 : Rappels et Notifications [OPTIONNELLE]

**Objectif** : Envoyer des rappels automatiques J-1 et demander des avis après prestation.

**Temps estimé** : 2-3 heures  
**Complexité** : Faible-Moyenne  
**Faisable en 1 conversation** : Oui ✅

### Composants à développer

#### 4.1 : Cron job pour rappels automatiques
**Fichier** : `/src/app/api/cron/reminders/route.ts` (Vercel Cron)

**Logique** :
1. S'exécute tous les jours à 09:00
2. Récupère toutes les réservations du lendemain
3. Envoie un email de rappel à chaque client via Resend
4. Envoie un SMS (optionnel) via Twilio

**Template email rappel** :
- Sujet : "Rappel : Votre lavage Royal Wash Pro demain à [heure]"
- Contenu : Confirmation RDV, adresse, préparation véhicule, contact urgence

#### 4.2 : Demande d'avis automatique
**Fichier** : `/src/app/api/cron/reviews/route.ts`

**Logique** :
1. S'exécute tous les jours à 20:00
2. Récupère réservations d'hier avec statut "completed"
3. Envoie email demandant avis Google + avis interne
4. Offre 50 points fidélité si avis laissé

**Template email avis** :
- Sujet : "Comment s'est passé votre lavage ? 🚗✨"
- Contenu : Satisfaction, lien Google Review, formulaire avis interne, code promo fidélité

### Configuration Vercel Cron
Dans `vercel.json` :
```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/reviews",
      "schedule": "0 20 * * *"
    }
  ]
}
```

### Tests
- Tester manuellement les endpoints `/api/cron/reminders` et `/api/cron/reviews`
- Vérifier emails envoyés
- Déployer sur Vercel et vérifier exécution automatique

### Statut : En attente (optionnel)

---

## 🗄️ PHASE 5 : Migration Supabase [OPTIONNELLE - FUTUR]

**Objectif** : Migrer de fichiers JSON vers une vraie base de données PostgreSQL cloud.

**Quand faire cette phase ?** : Seulement quand nécessaire, c'est-à-dire :
- Plus de 1000 leads dans `leads.json` (performances dégradées)
- Besoin de recherches complexes (SQL queries)
- Besoin d'accès concurrent (plusieurs admins)
- Besoin de backup automatique cloud

**Temps estimé** : 4-6 heures  
**Complexité** : Moyenne  
**Faisable en 1 conversation** : Oui ✅

### Étapes de migration

1. **Créer compte Supabase** : https://supabase.com/dashboard
2. **Créer projet** et récupérer credentials
3. **Définir schéma de tables** (leads, bookings, availability, etc.)
4. **Migrer données existantes** de JSON vers PostgreSQL
5. **Modifier toutes les API routes** pour utiliser Supabase au lieu de fs
6. **Tester que tout fonctionne**
7. **Supprimer fichiers JSON** (après backup)

### Statut : Non prioritaire pour l'instant

---

## 🎨 PHASE 6 : Optimisations UX/UI [OPTIONNELLE]

**Objectif** : Améliorer design, animations, performances.

**Éléments à optimiser** :
- Animations micro-interactions (Framer Motion)
- Skeleton loaders pendant chargements
- Optimisation images (WebP, lazy loading)
- Dark mode
- Amélioration mobile (gestures, bottom sheets)
- Confetti après paiement réussi
- Progressive Web App (installable)

**Temps** : Variable selon ambitions  
**Faisable en 1 conversation** : Oui pour 2-3 améliorations ciblées

### Statut : Cosmétique, non critique

---

## 📊 PHASE 7 : Analytics et A/B Testing [OPTIONNELLE]

**Objectif** : Mesurer performances et optimiser conversions.

**Outils à intégrer** :
- PostHog (analytics + heatmaps + session replay)
- Vercel Analytics (Core Web Vitals)
- Google Analytics 4 (optionnel)

**A/B tests à faire** :
- Couleur bouton CTA principal
- Ordre des formules (Standard/Premium/VIP vs Premium/Standard/VIP)
- Texte bouton ("Réserver" vs "Réserver en 3 min" vs "Obtenir mon créneau")
- Prix affiché (70€ vs 70€/voiture vs À partir de 70€)

**Temps** : 2-3 heures  
**Faisable en 1 conversation** : Oui ✅

### Statut : Optionnel, pour optimisation avancée

---

## 🚀 ORDRE RECOMMANDÉ DES PHASES

### Pour lancement MVP rapide (1 semaine)
1. Phase 1 : Base ✅ (déjà fait)
2. Phase 2 : Emails ✅ (code fait, config 5min)
3. Phase 3 : Réservation + Paiement ⏳ (prochaine)
4. **LANCEMENT** → Commencer à prendre des clients

### Après lancement (amélioration continue)
5. Phase 4 : Rappels automatiques
6. Phase 6 : Optimisations UX
7. Phase 7 : Analytics et tests
8. Phase 5 : Migration Supabase (si nécessaire)

### Scale (si business décolle)
- Multi-opérateurs
- App mobile
- Programme fidélité avancé
- API B2B

---

## 💡 ASTUCES POUR DÉVELOPPEMENT EFFICACE

### Avant chaque conversation
1. Ouvrir `CHECKPOINT.md` pour voir le statut immédiat
2. Identifier la phase à développer
3. Lire la section correspondante dans ce guide
4. Avoir `DEVELOPMENT_LOG.md` ouvert pour référence

### Pendant la conversation
1. Mentionner clairement la phase voulue : "Je veux développer Phase 3"
2. Laisser Claude développer de manière autonome
3. Tester au fur et à mesure (ne pas attendre la fin)
4. Demander clarifications si quelque chose n'est pas clair

### Après chaque conversation
1. Tester complètement la phase développée
2. Vérifier que `CHECKPOINT.md` est à jour
3. Faire un commit Git si tu utilises Git
4. Backup des fichiers de données (`leads.json`, `bookings.json`)

### Si une phase prend plus d'1 conversation
Découper en sous-phases plus petites. Par exemple, Phase 3 peut être découpée :
- Conversation 1 : Gestion disponibilités + calendrier
- Conversation 2 : Intégration Stripe + webhook
- Conversation 3 : Page confirmation + tests complets

---

**Dernière mise à jour** : 26 octobre 2025, 15:15  
**Fichier maintenu à jour automatiquement** : Oui ✅  
**Utilisation** : Référence technique pour chaque phase du projet
