# 🔐 Guide de Configuration Stripe - Royal Wash Pro

Ce guide vous explique comment configurer Stripe pour accepter les paiements en ligne sur votre site de réservation.

**Temps estimé** : 10 minutes  
**Coût** : Gratuit en mode test, 1,4% + 0,25€ par transaction en production

---

## 📋 Vue d'ensemble

Stripe est la plateforme de paiement que nous utilisons pour :
- ✅ Accepter les paiements par carte bancaire de manière sécurisée
- ✅ Garantir la présence du client (paiement = confirmation)
- ✅ Bloquer automatiquement les créneaux horaires après paiement
- ✅ Éviter 100% des no-shows (clients qui ne viennent pas)

---

## 🚀 Étape 1 : Créer un compte Stripe

### 1.1 Inscription

Rendez-vous sur **https://dashboard.stripe.com/register**

Remplissez le formulaire avec :
- Votre email (utilisez celui de Royal Wash Pro)
- Un mot de passe sécurisé
- Le nom de votre entreprise : "Royal Wash Pro"

### 1.2 Vérification

Stripe vous demandera de vérifier votre email. Cliquez sur le lien dans l'email de confirmation.

---

## 🔑 Étape 2 : Récupérer les clés API TEST

**IMPORTANT** : Nous allons d'abord utiliser les clés TEST pour tester le système sans risque.

### 2.1 Activer le mode test

Dans le dashboard Stripe, en haut à droite, assurez-vous que le toggle "Mode test" est activé (il doit être bleu).

### 2.2 Accéder aux clés API

1. Cliquez sur **"Développeurs"** dans le menu de gauche
2. Cliquez sur **"Clés API"**
3. Vous verrez deux clés :
   - **Clé publique** (commence par `pk_test_`)
   - **Clé secrète** (commence par `sk_test_`)

### 2.3 Copier les clés dans .env.local

Ouvrez le fichier `.env.local` à la racine de votre projet et remplacez :

```bash
# Remplacer cette ligne :
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_VOTRE_CLE_PUBLIQUE_ICI

# Par votre vraie clé publique (exemple) :
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51AbC123XyZ...

# Remplacer cette ligne :
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI

# Par votre vraie clé secrète (exemple) :
STRIPE_SECRET_KEY=sk_test_51AbC123XyZ...
```

**⚠️ SÉCURITÉ** : Ne partagez JAMAIS votre clé secrète publiquement !

---

## 🪝 Étape 3 : Configurer les Webhooks

Les webhooks permettent à Stripe de notifier votre site quand un paiement est réussi.

### 3.1 Créer un endpoint webhook

1. Dans le dashboard Stripe, allez dans **"Développeurs" → "Webhooks"**
2. Cliquez sur **"Ajouter un endpoint"**
3. Dans "URL du endpoint", entrez :
   ```
   http://localhost:3000/api/webhooks/stripe
   ```
   (Pour le moment, nous testons en local. Vous changerez cette URL plus tard en production)

4. Dans "Événements à envoyer", cliquez sur **"Sélectionner des événements"**
5. Cochez **"checkout.session.completed"**
6. Cliquez sur **"Ajouter un endpoint"**

### 3.2 Récupérer le secret du webhook

1. Cliquez sur l'endpoint que vous venez de créer
2. Dans la section "Secret de signature", cliquez sur **"Révéler"**
3. Copiez le secret (commence par `whsec_`)
4. Ajoutez-le dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_VotreSeCrEtDuWebHooK
```

### 3.3 Tester les webhooks localement (Important !)

Pour que Stripe puisse envoyer des webhooks à votre ordinateur en développement, nous devons utiliser Stripe CLI.

**Option A : Télécharger Stripe CLI** (recommandé)
1. Téléchargez depuis : https://stripe.com/docs/stripe-cli
2. Installez sur votre ordinateur
3. Ouvrez un nouveau terminal et connectez-vous :
   ```bash
   stripe login
   ```
4. Lancez l'écoute des webhooks :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
5. Stripe CLI vous donnera un nouveau webhook secret (commence par `whsec_`). Copiez-le dans `.env.local`

**Option B : Ne pas tester les webhooks localement**
Si vous ne voulez pas installer Stripe CLI :
- Les paiements fonctionneront
- Mais les réservations ne seront créées automatiquement qu'en production (quand le site sera en ligne)

---

## 🧪 Étape 4 : Tester le paiement

### 4.1 Démarrer le serveur

```bash
npm run dev
```

### 4.2 Faire une réservation de test

1. Ouvrez http://localhost:3000/reserver
2. Sélectionnez une formule (exemple : Premium)
3. Choisissez une date et une heure
4. Remplissez vos coordonnées (inventez-les si besoin)
5. Acceptez les CGV
6. Cliquez sur "Payer 70 €"

### 4.3 Utiliser une carte de test

Stripe vous redirigera vers la page de paiement. Utilisez cette carte TEST :

```
Numéro de carte : 4242 4242 4242 4242
Date d'expiration : 12/34 (n'importe quelle date future)
CVC : 123
Code postal : 13800
```

**Autres cartes de test utiles** :
- `4000 0027 6000 3184` : Authentification 3D Secure requise
- `4000 0000 0000 0002` : Carte déclinée (pour tester les erreurs)

### 4.4 Vérifier que tout fonctionne

Après le paiement, vous devriez :
1. ✅ Être redirigé vers la page de confirmation
2. ✅ Voir les détails de votre réservation
3. ✅ Voir un QR code de confirmation
4. ✅ Pouvoir télécharger un fichier calendrier (.ics)

Dans votre projet, vérifiez :
1. Un nouveau fichier `bookings.json` a été créé avec votre réservation
2. Le fichier `availability.json` a été mis à jour (le créneau est marqué comme réservé)

---

## 📊 Étape 5 : Vérifier dans le dashboard Stripe

1. Retournez sur https://dashboard.stripe.com
2. Allez dans **"Paiements"**
3. Vous devriez voir votre paiement de test avec le statut "Réussi"
4. Cliquez dessus pour voir tous les détails

---

## 🚀 Étape 6 : Passer en production (plus tard)

Quand votre site sera prêt à accepter de vrais paiements :

### 6.1 Activer votre compte Stripe

1. Remplissez les informations de votre entreprise dans Stripe
2. Ajoutez vos informations bancaires pour recevoir les paiements
3. Vérifiez votre identité (Stripe demandera des documents)

### 6.2 Récupérer les clés de production

1. Désactivez le "Mode test" dans le dashboard
2. Allez dans **"Développeurs" → "Clés API"**
3. Copiez les nouvelles clés (elles commencent par `pk_live_` et `sk_live_`)
4. Mettez-les à jour dans vos variables d'environnement de PRODUCTION

### 6.3 Configurer les webhooks de production

1. Créez un nouvel endpoint webhook avec votre vraie URL :
   ```
   https://votre-domaine.com/api/webhooks/stripe
   ```
2. Copiez le nouveau secret webhook
3. Mettez-le à jour dans vos variables d'environnement de PRODUCTION

---

## 💡 Conseils et astuces

### Frais Stripe en France

- **Mode test** : 100% gratuit, paiements simulés
- **Mode production** :
  - Cartes européennes : 1,4% + 0,25€ par transaction
  - Exemple : Pour un lavage à 70€, vous payez ~1,23€ à Stripe, vous recevez 68,77€

### Délais de paiement

- Les paiements arrivent sur votre compte bancaire sous **2 jours ouvrés** par défaut
- Vous pouvez configurer des virements quotidiens ou hebdomadaires

### Support Stripe

Si vous avez des questions, le support Stripe est excellent :
- Chat en direct dans le dashboard
- Email : support@stripe.com
- Documentation : https://stripe.com/docs

---

## ❓ Résolution de problèmes

### "Clé API invalide"
→ Vérifiez que vous avez bien copié toute la clé, sans espace avant/après
→ Vérifiez que vous êtes en mode test (clés `pk_test_` et `sk_test_`)

### "Webhook signature verification failed"
→ Vérifiez que le `STRIPE_WEBHOOK_SECRET` correspond bien à celui de votre endpoint
→ Si vous utilisez Stripe CLI, utilisez le secret fourni par la commande `stripe listen`

### Le créneau n'est pas bloqué après paiement
→ Vérifiez que le webhook est bien configuré et reçoit les événements
→ Regardez les logs du serveur pour voir si le webhook est appelé

### Le paiement fonctionne mais pas de confirmation
→ Vérifiez que le fichier `bookings.json` est créé après le paiement
→ Vérifiez que l'URL de succès dans le checkout est correcte

---

## ✅ Checklist finale

Avant de considérer Stripe comme configuré :

- [ ] Compte Stripe créé et vérifié
- [ ] Clés API TEST copiées dans `.env.local`
- [ ] Webhook configuré avec le bon endpoint
- [ ] Secret webhook copié dans `.env.local`
- [ ] Stripe CLI installé et `stripe listen` en cours (optionnel mais recommandé)
- [ ] Test de paiement réussi avec la carte 4242
- [ ] Page de confirmation affichée correctement
- [ ] Fichier `bookings.json` créé
- [ ] Créneau bloqué dans `availability.json`
- [ ] QR code généré et affiché

---

**Félicitations ! 🎉**

Votre système de paiement Stripe est maintenant configuré. Vous pouvez accepter des réservations avec paiement obligatoire, ce qui garantit zéro no-show et automatise complètement votre gestion de créneaux.

**Prochaine étape** : Testez le système complet plusieurs fois pour vous assurer que tout fonctionne parfaitement avant de passer en production.
