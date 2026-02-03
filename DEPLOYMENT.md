# 🚀 Guide de Déploiement - ALAFIA

Ce guide vous accompagne dans le déploiement de l'application ALAFIA sur Netlify.

## 📋 Prérequis

- Compte GitHub
- Compte Netlify (gratuit)
- Node.js 18+ installé localement
- Git installé

---

## 🔧 Préparation du Projet

### 1. Initialiser Git (si pas déjà fait)

```bash
cd alafia-app
git init
git add .
git commit -m "Initial commit - ALAFIA application"
```

### 2. Créer un Repository GitHub

1. Allez sur [GitHub](https://github.com)
2. Cliquez sur "New repository"
3. Nommez-le `alafia-app`
4. Ne cochez aucune option (README, .gitignore, etc.)
5. Cliquez sur "Create repository"

### 3. Pousser le Code sur GitHub

```bash
git remote add origin https://github.com/VOTRE_USERNAME/alafia-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 Déploiement sur Netlify

### Option 1 : Via l'Interface Web (Recommandé)

#### Étape 1 : Connexion à Netlify

1. Allez sur [netlify.com](https://www.netlify.com)
2. Cliquez sur "Sign up" ou "Log in"
3. Connectez-vous avec votre compte GitHub

#### Étape 2 : Importer le Projet

1. Cliquez sur "Add new site" → "Import an existing project"
2. Sélectionnez "GitHub"
3. Autorisez Netlify à accéder à vos repositories
4. Sélectionnez le repository `alafia-app`

#### Étape 3 : Configuration du Build

Netlify devrait détecter automatiquement Next.js. Vérifiez :

- **Branch to deploy** : `main`
- **Build command** : `npm run build`
- **Publish directory** : `.next`

Le fichier `netlify.toml` à la racine du projet configure déjà tout cela.

#### Étape 4 : Variables d'Environnement (Optionnel)

Si vous avez des variables d'environnement :

1. Allez dans "Site settings" → "Environment variables"
2. Ajoutez vos variables :
   ```
   NEXT_PUBLIC_API_URL=https://votre-api.com
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=votre_secret_jwt
   ```

#### Étape 5 : Déployer

1. Cliquez sur "Deploy site"
2. Attendez que le build se termine (2-5 minutes)
3. Votre site sera disponible sur `https://random-name.netlify.app`

#### Étape 6 : Personnaliser le Domaine

1. Allez dans "Site settings" → "Domain management"
2. Cliquez sur "Options" → "Edit site name"
3. Changez en `alafia` (si disponible)
4. Votre site sera maintenant sur `https://alafia.netlify.app`

---

### Option 2 : Via Netlify CLI

#### Installation

```bash
npm install -g netlify-cli
```

#### Connexion

```bash
netlify login
```

#### Déploiement

```bash
# Depuis le dossier alafia-app
netlify init

# Suivez les instructions :
# - Create & configure a new site
# - Sélectionnez votre équipe
# - Nom du site : alafia
# - Build command : npm run build
# - Publish directory : .next

# Déployer
netlify deploy --prod
```

---

## 🔄 Déploiement Continu (CI/CD)

Une fois connecté à GitHub, Netlify déploiera automatiquement :

- ✅ À chaque push sur la branche `main`
- ✅ Preview deployments pour les Pull Requests
- ✅ Rollback facile vers les versions précédentes

### Workflow

```
1. Développement local
   ↓
2. git add . && git commit -m "message"
   ↓
3. git push origin main
   ↓
4. Netlify détecte le push
   ↓
5. Build automatique
   ↓
6. Déploiement en production
   ↓
7. Site mis à jour ! 🎉
```

---

## 🗄️ Configuration de la Base de Données

### MongoDB Atlas (Recommandé)

#### 1. Créer un Cluster

1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un nouveau cluster (M0 Free Tier)
4. Région : Choisissez la plus proche (Europe ou Afrique)

#### 2. Configuration

1. **Database Access** :
   - Créez un utilisateur avec mot de passe
   - Notez le username et password

2. **Network Access** :
   - Ajoutez `0.0.0.0/0` (accès depuis partout)
   - Ou ajoutez les IPs de Netlify

3. **Connection String** :
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez la connection string :
     ```
     mongodb+srv://username:password@cluster.mongodb.net/alafia?retryWrites=true&w=majority
     ```

#### 3. Ajouter à Netlify

1. Netlify Dashboard → Site settings → Environment variables
2. Ajoutez :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alafia
   ```

#### 4. Importer les Données

```bash
# Installer MongoDB Database Tools
# https://www.mongodb.com/try/download/database-tools

# Importer les pharmacies
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/alafia" \
  --collection pharmacies \
  --file data/pharmacies.json \
  --jsonArray
```

---

## 🔐 Variables d'Environnement

### Fichier `.env.local` (Développement)

Créez un fichier `.env.local` à la racine :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/alafia

# JWT
JWT_SECRET=votre_secret_super_securise_changez_moi
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=autre_secret_super_securise
REFRESH_TOKEN_EXPIRES_IN=7d

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Notifications (Optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe

# Twilio SMS (Optionnel)
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_PHONE_NUMBER=+228XXXXXXXX
```

### Netlify (Production)

Ajoutez les mêmes variables dans :
**Site settings → Environment variables**

⚠️ **Important** : Ne commitez JAMAIS le fichier `.env.local` !

Ajoutez à `.gitignore` :
```
.env.local
.env.*.local
```

---

## 📊 Monitoring et Analytics

### Netlify Analytics

1. Allez dans votre site Netlify
2. Onglet "Analytics"
3. Activez Netlify Analytics (4$/mois)

### Plausible Analytics (Alternative Gratuite)

1. Créez un compte sur [plausible.io](https://plausible.io)
2. Ajoutez le script dans `app/layout.tsx` :

```tsx
<Script
  defer
  data-domain="alafia.netlify.app"
  src="https://plausible.io/js/script.js"
/>
```

---

## 🐛 Debugging

### Logs Netlify

1. Netlify Dashboard → Deploys
2. Cliquez sur un deploy
3. Consultez les logs de build

### Erreurs Courantes

#### Build Failed

```bash
# Vérifiez localement
npm run build

# Si ça marche localement mais pas sur Netlify :
# - Vérifiez les variables d'environnement
# - Vérifiez la version de Node.js
```

#### 404 sur les Routes

Assurez-vous que `netlify.toml` contient :
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### API Routes ne Fonctionnent Pas

Les API routes Next.js fonctionnent automatiquement sur Netlify avec le plugin Next.js.

---

## 🔄 Mises à Jour

### Déployer une Mise à Jour

```bash
# 1. Faites vos modifications
# 2. Testez localement
npm run dev

# 3. Committez
git add .
git commit -m "Description des changements"

# 4. Poussez
git push origin main

# 5. Netlify déploie automatiquement ! ✨
```

### Rollback

Si un déploiement pose problème :

1. Netlify Dashboard → Deploys
2. Trouvez le dernier déploiement qui fonctionnait
3. Cliquez sur "..." → "Publish deploy"

---

## 🌍 Domaine Personnalisé (Optionnel)

### Acheter un Domaine

1. Achetez un domaine (ex: `alafia.tg` ou `alafia.com`)
2. Providers recommandés :
   - Namecheap
   - Google Domains
   - Cloudflare

### Configurer sur Netlify

1. Site settings → Domain management
2. Add custom domain
3. Entrez votre domaine : `alafia.tg`
4. Suivez les instructions pour configurer les DNS

### Configuration DNS

Ajoutez ces enregistrements chez votre provider :

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: alafia.netlify.app
```

### HTTPS

Netlify active automatiquement HTTPS avec Let's Encrypt (gratuit).

---

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Tests locaux passent (`npm run build`)
- [ ] Variables d'environnement configurées
- [ ] Base de données MongoDB configurée
- [ ] Données importées dans MongoDB
- [ ] `.env.local` dans `.gitignore`
- [ ] README.md à jour
- [ ] Code committé sur GitHub
- [ ] Netlify connecté au repository
- [ ] Build réussi sur Netlify
- [ ] Site accessible et fonctionnel
- [ ] Toutes les pages se chargent
- [ ] Formulaires fonctionnent
- [ ] Chatbot répond correctement
- [ ] Recherche de pharmacies fonctionne
- [ ] Géolocalisation fonctionne
- [ ] Responsive sur mobile testé
- [ ] SEO vérifié (métadonnées)
- [ ] Performance testée (Lighthouse)

---

## 🎉 Félicitations !

Votre application ALAFIA est maintenant en ligne ! 🚀

**URL de production** : `https://alafia.netlify.app`

### Prochaines Étapes

1. Partagez le lien avec vos utilisateurs
2. Collectez les retours
3. Itérez et améliorez
4. Ajoutez de nouvelles fonctionnalités

---

## 📞 Support

En cas de problème :

1. Consultez les [docs Netlify](https://docs.netlify.com)
2. Consultez les [docs Next.js](https://nextjs.org/docs)
3. Vérifiez les logs de build
4. Contactez le support Netlify

---

**Bon déploiement ! 🇹🇬**
