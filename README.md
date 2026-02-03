# 🏥 ALAFIA - Application de Santé pour Lomé

![ALAFIA](https://img.shields.io/badge/ALAFIA-Santé%20Lomé-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

**ALAFIA** est une application web moderne et complète destinée aux habitants de Lomé (Togo) pour faciliter l'accès aux soins de santé.

## ✨ Fonctionnalités

### 🔍 Recherche de Pharmacies
- **Pharmacies de garde** : Liste mise à jour des pharmacies ouvertes 24h/24
- **Géolocalisation** : Trouvez les pharmacies les plus proches de vous
- **Recherche de médicaments** : Localisez rapidement un médicament spécifique
- **Contact WhatsApp** : Contactez directement les pharmacies
- **Itinéraire Google Maps** : Navigation vers la pharmacie

### 🤖 Chatbot Médical IA
- Assistant santé intelligent propulsé par **Mistral AI (Open Source)**
- Réponses basées sur une base de connaissances médicale structurée
- Conseils adaptés au contexte togolais (symptômes, urgences)
- Orientation vers les soins appropriés et numéros d'urgence (118/8200)
- Streaming des réponses en temps réel

### 👥 Gestion Multi-Profils

#### 🏪 Compte Pharmacie
- Gestion du stock de médicaments
- Mise à jour du statut de garde
- Gestion des horaires et coordonnées

#### 🤰 Femmes Enceintes
- Carnet de suivi de grossesse
- Rappels de rendez-vous
- Conseils adaptés par semaine de grossesse
- Notifications pour hydratation et vitamines

#### 👴 Troisième Âge
- Gestion des traitements médicaux
- Rappels de prise de médicaments
- Suivi des rendez-vous médicaux
- Contact d'urgence

#### 🩸 Donneurs de Sang
- Profil avec groupe sanguin
- Historique des dons
- Notifications quand un hôpital a besoin de sang
- Localisation des centres de collecte

## 🚀 Technologies Utilisées

### Frontend
- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne et responsive
- **Lucide React** - Icônes modernes

### Backend
- **Next.js API Routes** - Backend intégré avec App Router
- **MongoDB Atlas** - Base de données NoSQL hébergée
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hachage robuste des mots de passe
- **Mongoose** - Modélisation des données

### Déploiement
- **Netlify** - Hébergement et CI/CD

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale

```bash
# Cloner le projet
cd alafia-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Architecture du Projet

```
alafia-app/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Page d'accueil (pharmacies)
│   ├── chatbot/page.tsx     # Chatbot médical
│   ├── auth/page.tsx        # Authentification
│   ├── layout.tsx           # Layout principal
│   └── globals.css          # Styles globaux
├── components/              # Composants réutilisables
│   ├── Navbar.tsx          # Navigation
│   ├── PharmacyCard.tsx    # Carte de pharmacie
│   └── SearchBar.tsx       # Barre de recherche
├── data/                    # Données
│   └── pharmacies.json     # Base de données des pharmacies
├── lib/                     # Utilitaires
│   └── utils.ts            # Fonctions helpers
├── types/                   # Types TypeScript
│   └── index.ts            # Définitions de types
├── public/                  # Fichiers statiques
├── netlify.toml            # Configuration Netlify
├── .env.example            # Template des variables d'environnement
└── package.json            # Dépendances

```

## 🔐 Configuration

L'application nécessite les variables d'environnement suivantes dans un fichier `.env.local` :

```bash
# MongoDB
MONGODB_URI=votre_url_mongodb

# Authentification
JWT_SECRET=votre_secret_jwt

# IA (Chatbot)
HUGGINGFACE_API_KEY=votre_cle_hugging_face
```

## 📊 Base de Données des Pharmacies

La base de données contient **15 pharmacies** de Lomé avec :
- ✅ Nom et adresse complète
- ✅ Numéros de téléphone et WhatsApp
- ✅ Coordonnées GPS (latitude/longitude)
- ✅ Statut de garde (24h/24 ou horaires)
- ✅ Liste des médicaments en stock
- ✅ Quartier de localisation

## 🎨 Design System

### Couleurs
- **Primary** : Vert médical (#2d8659) - Santé, nature, confiance
- **Accent** : Bleu-vert (#2d8686) - Modernité, technologie
- **Secondary** : Vert clair - Douceur, apaisement

### Animations
- Fade-in pour les éléments
- Slide-up pour les sections
- Scale-in pour les modales
- Transitions fluides sur tous les éléments interactifs

## 🔐 Sécurité

- Validation des formulaires côté client et serveur
- Hachage des mots de passe (bcrypt)
- Tokens JWT pour l'authentification
- Protection CSRF
- Sanitization des entrées utilisateur

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🌍 SEO

- Métadonnées optimisées
- Balises Open Graph
- Structure sémantique HTML5
- Performance optimisée (Lighthouse 90+)

## 🚧 Prochaines Étapes

## 🚧 Prochaines Étapes

### Fonctionnalités à venir
- [ ] **Notifications push** (via service workers) pour les rappels de médicaments.
- [ ] **Mode hors-ligne (PWA)** pour consulter les pharmacies sans connexion.
- [ ] **Carte interactive** (Leaflet/Mapbox) pour visualiser les pharmacies.
- [ ] **Multi-langues** : intégration de l'Ewe et du Mina.
- [ ] **Chatbot IA avancé** : intégration d'un modèle LLM pour des conseils plus poussés.
- [ ] **Tests automatisés** : tests unitaires et E2E.

## 📄 Licence

Ce projet est développé pour les habitants de Lomé, Togo.

## 👨‍💻 Développement

### Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Contact

Pour toute question ou suggestion, contactez l'équipe ALAFIA.

---

**Fait avec ❤️ pour le Togo** 🇹🇬
