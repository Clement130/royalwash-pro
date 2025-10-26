# Royal Wash Pro

Site web professionnel pour Royal Wash Pro - Service de lavage automobile premium avec système de capture de leads et envoi d'emails automatiques.

## Fonctionnalités

### Site Web
- **Design Moderne** : Interface utilisateur élégante avec des animations fluides
- **Responsive** : Parfaitement adapté à tous les appareils (mobile, tablette, desktop)
- **Sections Complètes** :
  - Hero section avec présentation
  - Services détaillés (6 services différents)
  - Tarifs transparents (3 formules)
  - Formulaire de contact avec gestion d'états
- **Navigation Fluide** : Menu de navigation fixe avec défilement fluide
- **Performance** : Construit avec Next.js 16 et Tailwind CSS pour des performances optimales

### Système de Capture de Leads 🎯
- **API REST** : Route `/api/contact` pour la gestion des leads
- **Stockage JSON** : Sauvegarde automatique dans `leads.json`
- **Validation** : Validation côté serveur des données (email, téléphone, etc.)
- **États de formulaire** : Chargement, succès, erreur
- **Messages utilisateur** : Feedback visuel pour l'utilisateur

### Emails Automatiques 📧
- **Email de confirmation** : Envoyé au client après soumission
- **Email de notification** : Envoyé à l'administrateur avec détails du lead
- **Templates HTML** : Emails professionnels et responsive
- **Powered by Resend** : Service d'envoi d'emails fiable

### Dashboard Administrateur 📊
- **Statistiques** : Total, aujourd'hui, cette semaine, nouveaux leads
- **Liste complète** : Tous les leads avec détails
- **Filtrage visuel** : Statuts avec badges colorés
- **Interface moderne** : Dashboard professionnel et responsive
- **Accès** : `/admin`

## Technologies Utilisées

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Pour un code type-safe
- **Tailwind CSS** - Framework CSS utilitaire
- **React** - Bibliothèque UI
- **Resend** - Service d'envoi d'emails
- **React Email** - Templates d'emails en React

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Puis éditez .env.local avec vos clés API

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer en production
npm start
```

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

```env
RESEND_API_KEY=re_votre_cle_api
ADMIN_EMAIL=votre-email@example.com
FROM_EMAIL=Royal Wash Pro <noreply@votredomaine.com>
```

### Configuration de Resend

Pour activer l'envoi d'emails automatiques, suivez le guide détaillé:
👉 [RESEND_SETUP.md](./RESEND_SETUP.md)

**Résumé rapide:**
1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre clé API
3. Ajoutez-la dans `.env.local`
4. (Optionnel) Configurez votre domaine pour la production

## Structure du Projet

```
royalwash-pro/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx            # Dashboard administrateur
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts        # API de gestion des leads
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx                # Page d'accueil
│   │   └── globals.css             # Styles globaux
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation
│   │   └── Footer.tsx              # Pied de page
│   ├── emails/
│   │   ├── client-confirmation.tsx # Template email client
│   │   └── admin-notification.tsx  # Template email admin
│   └── lib/
│       └── resend.ts               # Configuration Resend
├── leads.json                      # Stockage des leads
├── .env.local                      # Variables d'environnement
├── .env.example                    # Exemple de configuration
├── DEVELOPMENT_LOG.md              # Journal de développement
└── RESEND_SETUP.md                 # Guide configuration Resend
```

## Services

1. **Lavage Extérieur** - Nettoyage complet de la carrosserie
2. **Lavage Intérieur** - Nettoyage de l'habitacle
3. **Lavage Complet** - Formule combinée
4. **Polissage** - Correction des micro-rayures
5. **Protection Céramique** - Protection longue durée
6. **Rénovation Phares** - Restauration de la transparence

## Tarifs

- **Formule Essentielle** : 25€
- **Formule Premium** : 45€
- **Formule VIP** : 75€

## Contact

- **Localisation** : Marseille, France
- **Email** : contact@royalwashpro.com
- **Horaires** : Lun-Sam 8h-19h, Dim 9h-17h

## Développement

Le site est développé avec les meilleures pratiques :
- Code TypeScript type-safe
- Composants React réutilisables
- Design responsive mobile-first
- SEO optimisé
- Animations performantes

---

© 2025 Royal Wash Pro. Tous droits réservés.
