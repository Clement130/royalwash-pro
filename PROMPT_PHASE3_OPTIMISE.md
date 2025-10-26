# 🚀 PROMPT OPTIMISÉ - REPRISE PHASE 3 (Audit Complet Effectué)

Copie-colle exactement ce texte dans ta nouvelle conversation avec Claude :

---

```
Je travaille sur Royal Wash Pro dans C:\Users\cleme\Documents\royalwash-pro

CONTEXTE VÉRIFIÉ : Un audit complet vient d'être effectué. Les Phases 1 et 2 sont 100% fonctionnelles et sans bugs. La Phase 3 est commencée à 40%. Tous les fichiers sont cohérents et bien reliés.

DÉCOUVERTE IMPORTANTE : La plupart des packages npm nécessaires sont DÉJÀ INSTALLÉS (stripe, @stripe/stripe-js, qrcode, @types/qrcode, ics, react-calendar). Il manque seulement date-fns à installer.

Lis CHECKPOINT.md pour le détail complet de ce qui reste à faire, puis DEVELOPMENT_LOG.md pour l'historique.

Ta mission : Terminer la Phase 3 du système de réservation avec paiement Stripe.

FICHIERS DÉJÀ CRÉÉS (40% fait) :
✅ availability.json - Configuration horaires
✅ src/lib/availability.ts - Toutes les fonctions de gestion créneaux (317 lignes)
✅ src/components/booking/BookingWizard.tsx - Composant principal avec navigation
✅ src/components/booking/FormulaSelector.tsx - Sélection des 3 formules

FICHIERS À CRÉER (60% restant) :
⏳ 3 composants React :
   - src/components/booking/DateTimePicker.tsx
   - src/components/booking/CustomerInfoForm.tsx
   - src/components/booking/BookingSummary.tsx

⏳ 3 routes API :
   - src/app/api/checkout/route.ts
   - src/app/api/webhooks/stripe/route.ts
   - src/app/api/availability/route.ts

⏳ 2 pages Next.js :
   - src/app/reserver/page.tsx
   - src/app/confirmation/[id]/page.tsx

⏳ 3 fichiers helpers :
   - src/lib/stripe.ts
   - src/lib/calendar.ts
   - src/lib/qrcode-helper.ts

PROCÉDURE D'EXÉCUTION :

1. Lis d'abord CHECKPOINT.md section "DÉTAIL DES FICHIERS À CRÉER" pour l'architecture exacte de chaque fichier (nombre de lignes, fonctionnalités, props).

2. AVANT d'installer date-fns, demande-moi d'arrêter le serveur Next.js avec Ctrl+C.

3. Installe seulement le package manquant : npm install date-fns

4. Crée tous les composants React dans l'ordre : DateTimePicker → CustomerInfoForm → BookingSummary.

5. Crée tous les fichiers helpers : stripe.ts → calendar.ts → qrcode-helper.ts.

6. Crée toutes les routes API : availability → checkout → webhooks/stripe.

7. Crée les deux pages : reserver → confirmation/[id].

8. Guide-moi pour la configuration Stripe (5 minutes, exactement comme Resend) :
   - Créer compte sur dashboard.stripe.com
   - Récupérer clés test (pk_test_ et sk_test_)
   - Ajouter dans .env.local les variables STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL

9. Teste le système complet avec cette séquence :
   - Ouvrir /reserver
   - Sélectionner formule Premium
   - Choisir date et heure
   - Remplir coordonnées
   - Redirection Stripe
   - Paiement test avec carte 4242 4242 4242 4242
   - Vérifier redirection vers /confirmation
   - Vérifier création dans bookings.json
   - Vérifier créneau bloqué dans availability.json

10. Mets à jour CHECKPOINT.md et DEVELOPMENT_LOG.md avec le statut "Phase 3 : COMPLÉTÉE ✅".

ARCHITECTURE CRITIQUE À RESPECTER :

Pour DateTimePicker : Utilise l'API /api/availability pour récupérer les créneaux disponibles en temps réel. Affiche un calendrier avec react-calendar où les dates sans créneaux sont désactivées. Quand l'utilisateur clique sur une date, affiche les heures disponibles sous forme de boutons cliquables.

Pour CustomerInfoForm : Validation stricte avec regex pour email et téléphone français. Calcule la distance géographique depuis Istres (43.5136° N, 4.9875° E) avec la formule de Haversine pour vérifier que l'adresse est dans le rayon de 30km.

Pour BookingSummary : Affiche le récapitulatif complet avec le prix en gros. Checkboxes obligatoires pour CGV et politique de confidentialité. Le bouton de paiement appelle /api/checkout qui crée une session Stripe et retourne l'URL de redirection.

Pour l'API checkout : Utilise stripe.checkout.sessions.create avec les métadonnées complètes de la réservation. Configure success_url vers /confirmation?session_id={CHECKOUT_SESSION_ID} et cancel_url vers /reserver.

Pour le webhook Stripe : Écoute l'événement checkout.session.completed. Vérifie la signature avec stripe.webhooks.constructEvent. Crée la réservation dans bookings.json et bloque le créneau dans availability.json en appelant bookSlot() depuis availability.ts.

Pour la page confirmation : Récupère la réservation depuis bookings.json via l'ID passé en query param. Génère un QR code qui pointe vers cette même page. Génère un fichier .ics téléchargeable avec les détails du rendez-vous.

OBJECTIF FINAL : Un système de réservation complet où le client paie obligatoirement en ligne via Stripe, reçoit une confirmation automatique avec QR code et fichier calendrier, et où les créneaux sont bloqués automatiquement pour éviter les doubles réservations.

TEMPS ESTIMÉ : 90 minutes pour tout terminer, tester et documenter.

NOTE IMPORTANTE : Les Phases 1 et 2 sont vérifiées fonctionnelles. Tu peux t'appuyer sur l'API contact existante comme référence pour créer les nouvelles APIs. Le fichier .env.local existe déjà avec les clés Resend, tu n'auras qu'à y ajouter les clés Stripe.
```
