# 📡 Documentation API - ALAFIA

## Base URL
```
Production: https://alafia.netlify.app/api
Development: http://localhost:3000/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

---

## 🔐 Authentification

### POST /api/auth/register
Créer un nouveau compte utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "pharmacy|pregnant|elderly|donor",
  "profile": {
    // Données spécifiques au rôle
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "pharmacy"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Errors:**
- 400: Validation error
- 409: Email already exists

---

### POST /api/auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "pharmacy"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Errors:**
- 401: Invalid credentials
- 404: User not found

---

### POST /api/auth/refresh
Renouveler le token d'accès

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

---

### POST /api/auth/logout
Déconnexion (invalide le refresh token)

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🏥 Pharmacies

### GET /api/pharmacies
Récupérer la liste des pharmacies

**Query Parameters:**
- `search` (string): Recherche par nom, quartier ou médicament
- `lat` (number): Latitude pour tri par proximité
- `lng` (number): Longitude pour tri par proximité
- `onDuty` (boolean): Filtrer les pharmacies de garde
- `limit` (number): Nombre de résultats (default: 50)
- `page` (number): Page de résultats (default: 1)

**Example:**
```
GET /api/pharmacies?search=paracétamol&lat=6.13&lng=1.21&onDuty=true
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pharmacies": [
      {
        "id": "pharmacy_id",
        "name": "Pharmacie Château-D'eau",
        "address": "Près du Château d'eau de Bè",
        "phone": "+228 96 80 08 88",
        "whatsapp": "+228 96 80 08 88",
        "quartier": "Bè",
        "location": {
          "latitude": 6.1319,
          "longitude": 1.2123
        },
        "isOnDuty": true,
        "hours": "24h/24",
        "medications": ["Paracétamol", "Amoxicilline", ...],
        "distance": 1.2 // Si lat/lng fournis
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 50,
      "pages": 1
    }
  }
}
```

---

### GET /api/pharmacies/:id
Récupérer une pharmacie spécifique

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pharmacy": {
      "id": "pharmacy_id",
      "name": "Pharmacie Château-D'eau",
      // ... autres champs
      "medications": [
        {
          "name": "Paracétamol",
          "quantity": 150,
          "price": 500,
          "expiryDate": "2026-12-31"
        }
      ]
    }
  }
}
```

**Errors:**
- 404: Pharmacy not found

---

### POST /api/pharmacies
Créer une nouvelle pharmacie (Authentification requise - role: pharmacy)

**Headers:** Authorization required

**Body:**
```json
{
  "name": "Pharmacie Test",
  "license": "PH-2026-001",
  "address": "123 Rue Test, Lomé",
  "phone": "+228 XX XX XX XX",
  "whatsapp": "+228 XX XX XX XX",
  "quartier": "Bè",
  "latitude": 6.1319,
  "longitude": 1.2123,
  "hours": "8h-20h"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "pharmacy": {
      "id": "new_pharmacy_id",
      // ... données de la pharmacie
    }
  }
}
```

---

### PUT /api/pharmacies/:id
Mettre à jour une pharmacie (Authentification requise - owner only)

**Headers:** Authorization required

**Body:** (tous les champs optionnels)
```json
{
  "isOnDuty": true,
  "hours": "24h/24",
  "medications": [
    {
      "name": "Paracétamol",
      "quantity": 200,
      "price": 500,
      "expiryDate": "2026-12-31"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pharmacy": {
      // ... données mises à jour
    }
  }
}
```

---

### DELETE /api/pharmacies/:id
Supprimer une pharmacie (Authentification requise - owner only)

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Pharmacy deleted successfully"
}
```

---

## 💊 Médicaments

### GET /api/medications/search
Rechercher des médicaments dans toutes les pharmacies

**Query Parameters:**
- `q` (string, required): Nom du médicament
- `lat` (number): Latitude
- `lng` (number): Longitude

**Example:**
```
GET /api/medications/search?q=paracétamol&lat=6.13&lng=1.21
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "medication": "Paracétamol",
    "pharmacies": [
      {
        "pharmacy": {
          "id": "pharmacy_id",
          "name": "Pharmacie Château-D'eau",
          "address": "...",
          "phone": "...",
          "distance": 1.2
        },
        "stock": {
          "quantity": 150,
          "price": 500,
          "expiryDate": "2026-12-31"
        }
      }
    ]
  }
}
```

---

## 👤 Utilisateurs

### GET /api/users/profile
Récupérer le profil de l'utilisateur connecté

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "pregnant",
      "profile": {
        "name": "Marie Doe",
        "dueDate": "2026-08-15",
        "weeksPregnant": 12,
        // ... autres champs selon le rôle
      }
    }
  }
}
```

---

### PUT /api/users/profile
Mettre à jour le profil

**Headers:** Authorization required

**Body:**
```json
{
  "profile": {
    "weeksPregnant": 13,
    "nextCheckup": "2026-03-15"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      // ... profil mis à jour
    }
  }
}
```

---

## 🤖 Chatbot

### POST /api/chatbot
Envoyer un message au chatbot

**Body:**
```json
{
  "message": "J'ai mal à la tête",
  "context": {
    "userId": "user_id" // Optionnel
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "response": "Pour un mal de tête :\n\n✅ Conseils immédiats :...",
    "suggestions": [
      "Trouver une pharmacie proche",
      "Parler à un médecin"
    ]
  }
}
```

---

## 📅 Rendez-vous (Elderly & Pregnant)

### GET /api/appointments
Récupérer les rendez-vous de l'utilisateur

**Headers:** Authorization required

**Query Parameters:**
- `upcoming` (boolean): Seulement les rendez-vous à venir
- `completed` (boolean): Seulement les rendez-vous passés

**Response (200):**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "appointment_id",
        "date": "2026-03-15",
        "time": "10:00",
        "doctor": "Dr. Kofi",
        "location": "CHU Sylvanus Olympio",
        "reason": "Consultation prénatale",
        "completed": false
      }
    ]
  }
}
```

---

### POST /api/appointments
Créer un rendez-vous

**Headers:** Authorization required

**Body:**
```json
{
  "date": "2026-03-15",
  "time": "10:00",
  "doctor": "Dr. Kofi",
  "location": "CHU Sylvanus Olympio",
  "reason": "Consultation prénatale"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "new_appointment_id",
      // ... données du rendez-vous
    }
  }
}
```

---

## 🩸 Donneurs de Sang

### GET /api/donors
Rechercher des donneurs (Admin/Hospital only)

**Headers:** Authorization required

**Query Parameters:**
- `bloodType` (string): Groupe sanguin recherché
- `location` (string): Quartier
- `available` (boolean): Seulement les donneurs disponibles

**Response (200):**
```json
{
  "success": true,
  "data": {
    "donors": [
      {
        "id": "donor_id",
        "name": "John Doe",
        "bloodType": "O+",
        "phone": "+228 XX XX XX XX",
        "location": "Bè",
        "lastDonation": "2025-11-01",
        "availableForDonation": true
      }
    ]
  }
}
```

---

### POST /api/donors/alert
Envoyer une alerte aux donneurs (Admin/Hospital only)

**Headers:** Authorization required

**Body:**
```json
{
  "bloodType": "O+",
  "location": "CHU Sylvanus Olympio",
  "urgency": "high|medium|low",
  "message": "Besoin urgent de sang O+ pour une urgence"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notified": 15,
    "message": "15 donneurs ont été notifiés"
  }
}
```

---

## 🔔 Notifications

### GET /api/notifications
Récupérer les notifications de l'utilisateur

**Headers:** Authorization required

**Query Parameters:**
- `unread` (boolean): Seulement les non lues

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_id",
        "type": "reminder|alert|info",
        "title": "Rappel de rendez-vous",
        "message": "Vous avez un rendez-vous demain à 10h",
        "read": false,
        "createdAt": "2026-02-03T10:00:00Z"
      }
    ]
  }
}
```

---

### PUT /api/notifications/:id/read
Marquer une notification comme lue

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## ⚠️ Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## Format d'Erreur Standard

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

---

## 🔒 Rate Limiting

- **Authentification** : 5 requêtes/minute
- **API générale** : 100 requêtes/minute
- **Chatbot** : 20 requêtes/minute

Headers de réponse :
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1612345678
```

---

## 📝 Notes d'Implémentation

1. Toutes les dates sont en format ISO 8601
2. Les coordonnées GPS utilisent le système WGS84
3. Les distances sont en kilomètres
4. Les prix sont en Francs CFA (XOF)
5. Les numéros de téléphone sont au format international (+228)

---

**Documentation générée pour ALAFIA v1.0** 🚀
