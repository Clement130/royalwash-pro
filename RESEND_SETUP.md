# Configuration de Resend pour l'envoi d'emails

Ce guide vous explique comment configurer Resend pour l'envoi automatique d'emails lorsqu'un client soumet le formulaire de contact.

## Étape 1: Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre email

## Étape 2: Obtenir votre clé API

1. Connectez-vous à votre compte Resend
2. Allez dans **API Keys**
3. Cliquez sur **Create API Key**
4. Donnez un nom à votre clé (ex: "Royal Wash Pro")
5. Copiez la clé API (elle commence par `re_`)

## Étape 3: Configurer les variables d'environnement

1. Créez un fichier `.env.local` à la racine du projet (si ce n'est pas déjà fait):
   ```bash
   cp .env.example .env.local
   ```

2. Ouvrez `.env.local` et ajoutez vos informations:
   ```env
   RESEND_API_KEY=re_votre_cle_api_ici
   ADMIN_EMAIL=votre-email@example.com
   FROM_EMAIL=Royal Wash Pro <noreply@votredomaine.com>
   ```

### Variables expliquées:

- **RESEND_API_KEY**: Votre clé API Resend (obtenue à l'étape 2)
- **ADMIN_EMAIL**: L'email où vous recevrez les notifications de nouveaux leads
- **FROM_EMAIL**: L'email qui apparaîtra comme expéditeur

## Étape 4: Configuration de l'email "From"

### Pour les tests (gratuit):

Utilisez l'email par défaut de Resend:
```env
FROM_EMAIL=Royal Wash Pro <onboarding@resend.dev>
```

### Pour la production (recommandé):

1. Allez dans **Domains** dans votre dashboard Resend
2. Ajoutez votre domaine (ex: `royalwashpro.com`)
3. Ajoutez les enregistrements DNS fournis par Resend
4. Attendez la vérification (peut prendre quelques minutes)
5. Utilisez votre domaine:
   ```env
   FROM_EMAIL=Royal Wash Pro <contact@royalwashpro.com>
   ```

## Étape 5: Tester l'envoi d'emails

1. Redémarrez votre serveur de développement:
   ```bash
   npm run dev
   ```

2. Allez sur [http://localhost:3000](http://localhost:3000)

3. Remplissez le formulaire de contact

4. Vous devriez recevoir:
   - Un email de confirmation sur l'adresse du client
   - Un email de notification sur votre ADMIN_EMAIL

## Vérification

### Dans votre dashboard Resend:

1. Allez dans **Logs**
2. Vous devriez voir vos emails envoyés
3. Vérifiez le statut (delivered, bounced, etc.)

### Dans votre boîte mail:

- **Email client**: Devrait être reçu à l'adresse email soumise dans le formulaire
- **Email admin**: Devrait être reçu à votre ADMIN_EMAIL

## Troubleshooting

### Les emails ne partent pas:

1. ✅ Vérifiez que la clé API est correcte dans `.env.local`
2. ✅ Redémarrez le serveur après avoir modifié `.env.local`
3. ✅ Vérifiez les logs dans la console du serveur
4. ✅ Vérifiez les logs dans le dashboard Resend

### Les emails arrivent en spam:

1. Utilisez un domaine vérifié (pas `onboarding@resend.dev`)
2. Ajoutez les enregistrements SPF et DKIM
3. Ajoutez un enregistrement DMARC

### Erreur "Invalid API key":

- Vérifiez que votre clé API commence par `re_`
- Vérifiez qu'il n'y a pas d'espaces avant/après dans `.env.local`
- Créez une nouvelle clé API si nécessaire

## Limites du plan gratuit

Le plan gratuit de Resend offre:
- 3 000 emails / mois
- 100 emails / jour
- Pas de carte de crédit requise

Pour un site de lavage auto, c'est largement suffisant pour commencer!

## Support

- Documentation Resend: [https://resend.com/docs](https://resend.com/docs)
- Support Resend: support@resend.com

---

Une fois configuré, vos emails seront envoyés automatiquement à chaque soumission du formulaire! 🎉
