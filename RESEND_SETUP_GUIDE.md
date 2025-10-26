# Guide de Configuration Resend - Royal Wash Pro

## Objectif
Ce guide vous permet de configurer Resend en moins de 5 minutes pour automatiser complètement l'envoi d'emails à vos clients et vous notifier instantanément des nouveaux leads. Zéro intervention humaine requise après configuration.

## Pourquoi Resend ?
Resend est le meilleur choix pour automatiser les emails car :
- **3000 emails gratuits par mois** (100 clients = 200 emails, donc largement suffisant)
- **Configuration ultra-rapide** (pas de vérification complexe pour débuter)
- **API moderne et simple** (3 lignes de code suffisent)
- **Templates HTML natifs** (déjà implémentés dans le projet)
- **Excellente délivrabilité** (emails arrivent dans la boîte principale, pas les spams)
- **Dashboard clair** pour suivre tous les emails envoyés

## Étape 1 : Créer votre compte Resend (2 minutes)

### 1.1 Inscription
Ouvrez votre navigateur et allez sur : https://resend.com/signup

Vous avez deux options d'inscription :
- Connexion avec GitHub (recommandé, instantané)
- Connexion avec email (vous recevrez un lien de vérification)

Choisissez l'option GitHub si vous avez un compte, sinon utilisez votre email. Resend ne demande pas de carte bancaire pour démarrer.

### 1.2 Vérification du compte
Si vous utilisez GitHub, vous êtes immédiatement connecté. Si vous utilisez un email, vérifiez votre boîte de réception (et spam) pour le lien de vérification. Cliquez sur le lien pour activer votre compte.

## Étape 2 : Obtenir votre clé API (1 minute)

### 2.1 Accéder au dashboard
Une fois connecté, vous arrivez automatiquement sur le dashboard Resend.

Dans le menu de gauche, cliquez sur **"API Keys"**.

### 2.2 Créer une nouvelle clé API
Cliquez sur le bouton **"Create API Key"** en haut à droite.

Une fenêtre s'ouvre avec trois champs :
- **Name** : Donnez un nom descriptif comme "Royal Wash Pro Production"
- **Permission** : Sélectionnez "Full Access" (vous avez besoin d'envoyer des emails)
- **Domain** : Laissez vide pour l'instant (nous allons utiliser le domaine de test)

Cliquez sur **"Add"**.

### 2.3 Copier votre clé API
Une clé API s'affiche, elle commence par `re_` suivi d'une longue suite de caractères aléatoires.

**IMPORTANT** : Cette clé ne s'affichera qu'une seule fois. Si vous la perdez, vous devrez en créer une nouvelle.

Copiez cette clé entière et conservez-la précieusement dans un endroit sûr (bloc-notes temporaire).

## Étape 3 : Configurer les variables d'environnement (2 minutes)

### 3.1 Créer le fichier .env.local
Ouvrez votre explorateur de fichiers et naviguez vers le dossier du projet :
```
C:\Users\cleme\Documents\royalwash-pro
```

Si vous ne voyez pas le fichier `.env.local`, créez-le (c'est normal qu'il n'existe pas encore).

### 3.2 Ajouter les variables
Ouvrez `.env.local` avec votre éditeur de texte préféré (VS Code, Notepad++, ou même le Bloc-notes Windows).

Copiez-collez exactement ce contenu en remplaçant les valeurs d'exemple :

```env
# Configuration Resend pour les emails automatiques
RESEND_API_KEY=re_VotreCleAPICopieeEtape2_123456789

# Email qui envoie (utiliser le domaine test pour commencer)
RESEND_FROM_EMAIL=onboarding@resend.dev

# Votre email où vous recevrez les notifications
RESEND_TO_EMAIL=votre.vrai.email@gmail.com
```

**Remplacez les valeurs** :
- `RESEND_API_KEY` : Collez la clé API que vous avez copiée à l'étape 2.3
- `RESEND_FROM_EMAIL` : Laissez `onboarding@resend.dev` pour le moment (c'est le domaine test gratuit de Resend)
- `RESEND_TO_EMAIL` : Mettez votre vraie adresse email (Gmail, Outlook, etc.) où vous voulez recevoir les notifications de leads

### 3.3 Sauvegarder le fichier
Sauvegardez le fichier `.env.local` et fermez-le.

**Sécurité** : Ce fichier contient des secrets, ne le partagez jamais et ne le uploadez jamais sur GitHub. Il est automatiquement ignoré par Git grâce au `.gitignore`.

## Étape 4 : Redémarrer le serveur Next.js (30 secondes)

### 4.1 Arrêter le serveur actuel
Si votre serveur Next.js est en cours d'exécution (normalement il tourne avec `npm run dev`), appuyez sur `Ctrl+C` dans le terminal pour l'arrêter.

### 4.2 Redémarrer avec les nouvelles variables
Dans votre terminal, exécutez :
```bash
cd C:\Users\cleme\Documents\royalwash-pro
npm run dev
```

Le serveur redémarre et charge automatiquement les variables d'environnement du fichier `.env.local`.

## Étape 5 : Tester l'envoi d'emails (1 minute)

### 5.1 Ouvrir le site
Dans votre navigateur, allez sur : http://localhost:3000

### 5.2 Remplir le formulaire de contact
Descendez jusqu'à la section "Contactez-nous" et remplissez le formulaire avec :
- **Nom** : Votre prénom (pour tester)
- **Email** : Votre vraie adresse email (même que RESEND_TO_EMAIL)
- **Téléphone** : Un numéro fictif comme "0612345678"
- **Service** : Choisissez n'importe quelle formule
- **Message** : "Test du système d'emails automatiques"

### 5.3 Soumettre le formulaire
Cliquez sur "Envoyer la demande".

Vous devriez voir un message de succès en vert : "Merci ! Nous avons bien reçu votre demande..."

### 5.4 Vérifier la réception des emails
Dans les 30 secondes qui suivent, vérifiez votre boîte email (celle configurée dans RESEND_TO_EMAIL).

Vous devriez recevoir **DEUX emails** :

**Email 1 - Confirmation client** :
- Sujet : "✅ Confirmation de votre demande - Royal Wash Pro"
- Design professionnel avec fond bleu
- Contient votre nom, la formule choisie, et votre numéro de demande

**Email 2 - Notification admin** :
- Sujet : "🚗 Nouveau lead: [Votre Nom] - [SERVICE]"
- Design terminal/hacker avec fond noir et texte vert
- Contient toutes les informations du lead
- Boutons cliquables pour appeler ou envoyer un email

**Si les emails n'arrivent pas immédiatement**, vérifiez :
- Le dossier spam/courrier indésirable
- Que vous avez bien redémarré le serveur après avoir modifié .env.local
- La console du terminal pour voir s'il y a des erreurs

### 5.5 Vérifier dans le dashboard Resend
Retournez sur https://resend.com/emails

Vous devriez voir les deux emails envoyés avec leur statut "Delivered".

Si le statut est "Failed", cliquez dessus pour voir l'erreur détaillée.

## Configuration avancée (optionnel pour plus tard)

### Utiliser votre propre domaine
Une fois que vous avez votre nom de domaine (comme royalwashpro.com), vous pouvez l'ajouter à Resend pour que les emails viennent de "contact@royalwashpro.com" au lieu de "onboarding@resend.dev".

**Avantages** :
- Meilleure crédibilité professionnelle
- Meilleure délivrabilité
- Personnalisation complète

**Comment faire** :
1. Dans le dashboard Resend, cliquez sur "Domains" dans le menu de gauche
2. Cliquez sur "Add Domain"
3. Entrez votre nom de domaine (exemple: royalwashpro.com)
4. Resend vous donnera des enregistrements DNS à ajouter chez votre hébergeur
5. Une fois les DNS ajoutés, Resend vérifiera automatiquement (cela peut prendre 24-48h)
6. Modifiez `RESEND_FROM_EMAIL` dans `.env.local` pour utiliser votre domaine

Pour l'instant, le domaine test `onboarding@resend.dev` fonctionne parfaitement et est suffisant pour démarrer votre business.

## Dépannage

### Problème : "RESEND_API_KEY is not defined"
**Solution** : Vérifiez que le fichier `.env.local` est bien à la racine du projet (pas dans un sous-dossier) et que vous avez redémarré le serveur après l'avoir créé.

### Problème : Emails non reçus
**Solutions à essayer dans l'ordre** :
1. Vérifier le dossier spam/courrier indésirable
2. Vérifier que RESEND_TO_EMAIL contient bien votre vraie adresse email
3. Vérifier que RESEND_FROM_EMAIL est bien "onboarding@resend.dev"
4. Aller sur https://resend.com/emails et regarder le statut des emails (Delivered, Failed, etc.)
5. Regarder la console du terminal pour les messages d'erreur

### Problème : "Error: Missing API key"
**Solution** : Votre clé API n'est pas correctement copiée. Dans `.env.local`, assurez-vous que la clé est bien collée sans espace avant ou après. La clé doit commencer par "re_".

### Problème : Le formulaire dit "succès" mais aucun email n'est envoyé
**Solution** : C'est normal si les variables d'environnement ne sont pas configurées. Le système sauvegarde quand même le lead dans `leads.json` pour ne rien perdre. Configurez Resend pour activer les emails.

## Coûts et limites

### Plan gratuit Resend
- **3000 emails par mois** GRATUITS
- Illimité de domaines
- Support par email
- Dashboard complet avec analytics

### Calcul pour votre business
Si vous recevez **100 leads par mois** (ce qui est déjà excellent pour démarrer), cela représente :
- 100 emails de confirmation aux clients
- 100 emails de notification à vous
- **Total : 200 emails par mois**

Vous êtes donc largement en dessous de la limite gratuite de 3000 emails. Même avec 1000 leads par mois (2000 emails), vous restez dans le gratuit.

### Passage au plan payant (si nécessaire un jour)
Si votre business décolle et que vous dépassez 3000 emails/mois, le plan payant de Resend coûte :
- 20$/mois pour 50000 emails
- 0.001$ par email supplémentaire

Mais cela signifiera que vous avez plus de 1500 leads par mois, donc un chiffre d'affaires de 67500€/mois minimum avec la formule Premium. À ce stade, 20$ pour les emails sera négligeable.

## Prochaine étape après configuration

Une fois Resend configuré et testé avec succès, votre système est **100% automatisé** pour la capture de leads. Voici ce qui se passe maintenant sans aucune intervention de votre part :

1. Un client remplit le formulaire sur votre site
2. Le lead est sauvegardé automatiquement dans `leads.json`
3. Un email de confirmation est envoyé instantanément au client
4. Vous recevez une notification email immédiate avec toutes les infos
5. Vous pouvez voir tous les leads dans votre dashboard admin : http://localhost:3000/admin

La seule action humaine nécessaire : appeler ou emailer le client dans les 24h pour confirmer le rendez-vous. Tout le reste est automatique.

## Conseils d'optimisation

### Réactivité = Conversion
Plus vous répondez vite aux leads, plus vous convertissez. L'email de notification vous permet de réagir en quelques minutes. Installez l'application email de Resend sur votre téléphone pour recevoir les notifications push.

### Personnalisation des templates
Les templates HTML sont dans le fichier `src/lib/email-templates.ts`. Vous pouvez les modifier à tout moment pour ajuster :
- Les couleurs (actuellement bleu/orange Royal Wash Pro)
- Le texte
- Les informations affichées
- Le style visuel

### Suivi des performances
Dans le dashboard Resend (https://resend.com/emails), vous pouvez voir :
- Combien d'emails sont envoyés chaque jour
- Le taux de délivrabilité
- Les erreurs éventuelles
- Le temps de livraison moyen

Cela vous donne une vision claire du fonctionnement de votre système d'automatisation.

---

**Félicitations !** Vous avez maintenant un système d'emails entièrement automatisé qui fonctionne 24/7 sans aucune intervention manuelle. Chaque lead est capturé, traité, et vous êtes notifié instantanément pour maximiser vos conversions.
