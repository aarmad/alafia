# 🚀 Démarrage Rapide - ALAFIA

## Installation en 3 étapes

### 1️⃣ Installation des dépendances
```bash
cd alafia-app
npm install
```

### 2️⃣ Lancer le serveur de développement
```bash
npm run dev
```

### 3️⃣ Ouvrir dans le navigateur
```
http://localhost:3000
```

### 4️⃣ Configuration des Variables d'Environnement
Pour que le backend et le chatbot IA fonctionnent, créez un fichier `.env.local` à la racine :
```bash
MONGODB_URI=mongodb://localhost:27017/alafia
JWT_SECRET=votre_cle_secrete_aleatoire
HUGGING_FACE_API_KEY=votre_cle_hugging_face
```

---

## ✅ C'est tout !

L'application est maintenant accessible et fonctionnelle.

---

## 🎯 Que faire ensuite ?

### Tester l'application

1. **Page d'accueil** (`/`)
   - Voir les pharmacies de garde
   - Rechercher un médicament (ex: "paracétamol")
   - Activer la géolocalisation
   - Filtrer les pharmacies de garde

2. **Chatbot** (`/chatbot`)
   - Poser des questions santé
   - Tester avec : "J'ai mal à la tête", "fièvre", "paludisme"
   - Voir les conseils adaptés au Togo

3. **Authentification** (`/auth`)
   - Créer un compte (4 types de profils)
   - Tester les formulaires

### Personnaliser

1. **Ajouter des pharmacies**
   - Éditez `data/pharmacies.json`
   - Ajoutez vos données

2. **Modifier les couleurs**
   - Éditez `app/globals.css`
   - Changez les variables CSS

3. **Améliorer le chatbot**
   - Éditez `app/chatbot/page.tsx`
   - Ajoutez de nouvelles règles dans `generateResponse()`

### Déployer

Suivez le guide complet dans `DEPLOYMENT.md`

**Résumé rapide :**
```bash
# 1. Créer un repo GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/alafia-app.git
git push -u origin main

# 2. Connecter à Netlify
# - Allez sur netlify.com
# - "Add new site" → "Import from Git"
# - Sélectionnez votre repo
# - Deploy !
```

---

## 📚 Documentation

- **README.md** - Vue d'ensemble
- **ARCHITECTURE.md** - Architecture technique
- **API.md** - Documentation API
- **DEPLOYMENT.md** - Guide de déploiement
- **SUMMARY.md** - Récapitulatif complet

---

## 🆘 Problèmes Courants

### Le serveur ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur de port déjà utilisé
```bash
# Tuer le processus sur le port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erreurs TypeScript
```bash
# Vérifier les types
npm run type-check

# Si ça persiste, supprimer .next
rm -rf .next
npm run dev
```

---

## 🎨 Commandes Utiles

```bash
# Développement
npm run dev          # Lancer le serveur de dev

# Production
npm run build        # Créer le build de production
npm start            # Lancer le serveur de production

# Qualité du code
npm run lint         # Vérifier le code
npm run type-check   # Vérifier les types TypeScript

# Nettoyage
rm -rf .next         # Supprimer le cache Next.js
rm -rf node_modules  # Supprimer les dépendances
```

---

## 📱 Tester sur Mobile

### Option 1 : Même réseau WiFi
```bash
# Trouver votre IP locale
# Windows
ipconfig

# Linux/Mac
ifconfig

# Accéder depuis le mobile
http://VOTRE_IP:3000
# Ex: http://192.168.1.10:3000
```

### Option 2 : Tunnel (ngrok)
```bash
# Installer ngrok
npm install -g ngrok

# Créer un tunnel
ngrok http 3000

# Utiliser l'URL fournie (ex: https://abc123.ngrok.io)
```

---

## 🔥 Fonctionnalités Principales

### ✅ Déjà Implémentées
- 🏥 Liste des 15 pharmacies de Lomé
- 🔍 Recherche de médicaments
- 📍 Géolocalisation et calcul de distance
- 🤖 Chatbot médical intelligent
- 👤 Système multi-profils
- 📱 Design responsive
- 🎨 Interface moderne et fluide

### 🚧 À Implémenter (Backend)
- 🔐 Authentification JWT
- 💾 Base de données MongoDB
- 📧 Notifications email/SMS
- 🔔 Rappels automatiques
- 📊 Tableau de bord admin

---

## 💡 Astuces

### Développement Rapide
- Utilisez **Turbopack** (déjà activé) pour un rechargement ultra-rapide
- Les modifications CSS sont instantanées
- Hot reload activé pour tous les fichiers

### Debug
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs dans le terminal
- Utilisez React DevTools

### Performance
- Les images sont automatiquement optimisées
- Le code est automatiquement splitté
- Le CSS est purgé en production

---

## 🎓 Ressources

### Documentation Officielle
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Tutoriels
- [Next.js Learn](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [Tailwind Play](https://play.tailwindcss.com)

---

## 🎉 Vous êtes prêt !

L'application ALAFIA est maintenant opérationnelle.

**Bon développement ! 🇹🇬**

---

**Questions ?** Consultez la documentation complète ou les fichiers de ce projet.
