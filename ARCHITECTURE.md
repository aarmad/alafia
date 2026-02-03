# 🏗️ Architecture Technique - ALAFIA

## Vue d'ensemble

ALAFIA est une application web moderne construite avec une architecture **JAMstack** (JavaScript, APIs, Markup) optimisée pour la performance et la scalabilité.

## Stack Technique Complète

### Frontend

#### Framework & Langage
- **Next.js 16** (App Router)
  - Server-Side Rendering (SSR)
  - Static Site Generation (SSG)
  - API Routes intégrées
  - Optimisation automatique des images
  - Code splitting automatique

- **TypeScript 5**
  - Typage statique fort
  - Meilleure DX (Developer Experience)
  - Détection d'erreurs à la compilation
  - IntelliSense amélioré

#### Styling
- **Tailwind CSS 3**
  - Utility-first CSS
  - Design system personnalisé
  - Responsive design mobile-first
  - Dark mode ready
  - Purge CSS automatique en production

#### Icônes & Assets
- **Lucide React** - Icônes modernes et légères
- **Next/Image** - Optimisation automatique des images

### Backend (À implémenter)

#### API REST
```
Node.js + Express
├── Routes
│   ├── /api/auth          # Authentification
│   ├── /api/pharmacies    # CRUD pharmacies
│   ├── /api/users         # Gestion utilisateurs
│   ├── /api/medications   # Recherche médicaments
│   └── /api/chatbot       # Endpoints chatbot
├── Middleware
│   ├── auth.js            # Vérification JWT
│   ├── validation.js      # Validation des données
│   └── errorHandler.js    # Gestion des erreurs
└── Controllers
    ├── authController.js
    ├── pharmacyController.js
    └── userController.js
```

#### Base de Données
**MongoDB** (NoSQL)

Schémas de données :

```javascript
// User Schema
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: Enum ['pharmacy', 'pregnant', 'elderly', 'donor'],
  profile: Object (variant selon le role),
  createdAt: Date,
  updatedAt: Date
}

// Pharmacy Schema
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  license: String,
  address: String,
  phone: String,
  whatsapp: String,
  quartier: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  isOnDuty: Boolean,
  hours: String,
  medications: [{
    name: String,
    quantity: Number,
    price: Number,
    expiryDate: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Pregnant Profile Schema
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  age: Number,
  dueDate: Date,
  weeksPregnant: Number,
  lastCheckup: Date,
  nextCheckup: Date,
  notes: [String],
  reminders: [{
    title: String,
    description: String,
    date: Date,
    completed: Boolean,
    type: Enum
  }]
}

// Elderly Profile Schema
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  age: Number,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    time: [String],
    notes: String
  }],
  appointments: [{
    date: Date,
    time: String,
    doctor: String,
    location: String,
    reason: String,
    completed: Boolean
  }],
  healthConditions: [String],
  emergencyContact: String
}

// Donor Profile Schema
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  bloodType: Enum ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  lastDonation: Date,
  phone: String,
  location: String,
  availableForDonation: Boolean
}
```

#### Authentification
- **JWT (JSON Web Tokens)**
  - Access Token (15 min)
  - Refresh Token (7 jours)
- **bcryptjs** pour le hachage des mots de passe
- **Validation** avec Joi ou Zod

### Chatbot IA

#### Solution Open-Source Actuelle
**Système basé sur des règles** (Rule-based system)
- Pattern matching sur les mots-clés
- Réponses pré-définies adaptées au contexte togolais
- Pas de dépendance externe
- Rapide et fiable

#### Évolution Future
**Ollama + LLaMA 3** (Open-source)
```javascript
// Exemple d'intégration
import ollama from 'ollama'

async function chat(message: string) {
  const response = await ollama.chat({
    model: 'llama3',
    messages: [
      {
        role: 'system',
        content: 'Tu es un assistant médical pour Lomé, Togo...'
      },
      {
        role: 'user',
        content: message
      }
    ]
  })
  return response.message.content
}
```

### Notifications (À implémenter)

#### Web Push Notifications
- **Service Workers** pour les notifications push
- **Firebase Cloud Messaging (FCM)** - Alternative open-source : **OneSignal**

#### Email
- **Nodemailer** avec SMTP
- Templates HTML responsive

#### SMS (optionnel)
- **Twilio** ou service local togolais

## Architecture des Dossiers

```
alafia-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Groupe de routes authentifiées
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── settings/
│   ├── api/                     # API Routes Next.js
│   │   ├── auth/
│   │   ├── pharmacies/
│   │   └── chatbot/
│   ├── chatbot/
│   ├── auth/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                   # Composants React
│   ├── ui/                      # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── Navbar.tsx
│   ├── PharmacyCard.tsx
│   └── SearchBar.tsx
├── lib/                         # Bibliothèques et utilitaires
│   ├── db.ts                    # Connexion MongoDB
│   ├── auth.ts                  # Helpers d'authentification
│   ├── utils.ts                 # Fonctions utilitaires
│   └── validations.ts           # Schémas de validation
├── types/                       # Types TypeScript
│   ├── index.ts
│   ├── api.ts
│   └── models.ts
├── data/                        # Données statiques
│   └── pharmacies.json
├── hooks/                       # Custom React Hooks
│   ├── useAuth.ts
│   ├── useGeolocation.ts
│   └── usePharmacies.ts
├── contexts/                    # React Contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── public/                      # Assets statiques
│   ├── images/
│   ├── icons/
│   └── manifest.json
├── tests/                       # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local                   # Variables d'environnement
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Flux de Données

### 1. Authentification
```
Client → POST /api/auth/register
       → Validation des données
       → Hachage du mot de passe (bcrypt)
       → Création utilisateur dans MongoDB
       → Génération JWT
       → Retour token + user data
       → Stockage dans localStorage/cookies
```

### 2. Recherche de Pharmacies
```
Client → GET /api/pharmacies?search=paracétamol&lat=6.13&lng=1.21
       → Query MongoDB avec $text search + $geoNear
       → Tri par distance
       → Retour liste pharmacies
       → Affichage avec PharmacyCard
```

### 3. Chatbot
```
Client → Message utilisateur
       → POST /api/chatbot
       → Analyse du message (pattern matching ou IA)
       → Génération de la réponse
       → Retour réponse
       → Affichage dans l'interface
```

## Sécurité

### Authentification & Autorisation
- **JWT** stocké dans httpOnly cookies (protection XSS)
- **Refresh tokens** pour renouvellement
- **Rate limiting** sur les endpoints sensibles
- **CORS** configuré strictement

### Validation des Données
```typescript
// Exemple avec Zod
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['pharmacy', 'pregnant', 'elderly', 'donor'])
})
```

### Protection des Données
- **Hachage bcrypt** (salt rounds: 10)
- **Sanitization** des entrées (DOMPurify)
- **HTTPS** obligatoire en production
- **Helmet.js** pour headers de sécurité

## Performance

### Optimisations Frontend
- **Code splitting** automatique (Next.js)
- **Lazy loading** des composants
- **Image optimization** (Next/Image)
- **Minification** CSS/JS en production
- **Caching** agressif des assets statiques

### Optimisations Backend
- **Indexation MongoDB**
  ```javascript
  // Index géospatial pour recherche par proximité
  db.pharmacies.createIndex({ location: "2dsphere" })
  
  // Index texte pour recherche de médicaments
  db.pharmacies.createIndex({ "medications.name": "text" })
  ```
- **Caching Redis** (optionnel)
- **Compression gzip**
- **Connection pooling** MongoDB

### Métriques Cibles
- **Lighthouse Score** : 90+
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Cumulative Layout Shift** : < 0.1

## Déploiement

### Netlify (Frontend)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Backend (Options)
1. **Vercel** (serverless functions)
2. **Railway** (container)
3. **DigitalOcean** (VPS)
4. **Heroku** (PaaS)

### Base de Données
- **MongoDB Atlas** (cloud)
- **Replica Set** pour haute disponibilité
- **Backups** automatiques quotidiens

## Monitoring & Analytics

### Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Uptime Robot** - Monitoring uptime

### Analytics
- **Plausible** (open-source, privacy-first)
- **Google Analytics** (optionnel)

## CI/CD

### Pipeline
```yaml
# GitHub Actions
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run lint
      - run: npm run test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
```

## Évolutivité

### Scalabilité Horizontale
- **Serverless functions** (auto-scaling)
- **CDN** pour assets statiques (Netlify Edge)
- **Load balancing** si backend dédié

### Scalabilité Verticale
- **MongoDB sharding** pour grandes données
- **Read replicas** pour optimiser les lectures
- **Caching layers** (Redis)

## Accessibilité (a11y)

- **ARIA labels** sur tous les éléments interactifs
- **Keyboard navigation** complète
- **Screen reader** compatible
- **Contrast ratio** WCAG AA minimum
- **Focus indicators** visibles

## Internationalisation (i18n)

### Langues Supportées (Future)
- Français (par défaut)
- Ewe
- Mina

```typescript
// next-i18next
import { useTranslation } from 'next-i18next'

function Component() {
  const { t } = useTranslation('common')
  return <h1>{t('welcome')}</h1>
}
```

## Progressive Web App (PWA)

### Fonctionnalités
- **Service Worker** pour cache offline
- **Manifest.json** pour installation
- **Push notifications**
- **Offline mode** pour données critiques

```json
// manifest.json
{
  "name": "ALAFIA",
  "short_name": "ALAFIA",
  "description": "Votre santé à Lomé",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2d8659",
  "icons": [...]
}
```

---

**Architecture conçue pour la performance, la sécurité et l'évolutivité** 🚀
