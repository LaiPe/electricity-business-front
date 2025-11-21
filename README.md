# ⚡ Electricity Business - Frontend

**Interface utilisateur moderne pour la gestion de stations de recharge électrique**

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple?logo=bootstrap)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts Disponibles](#scripts-disponibles)
- [Architecture](#architecture)
- [Authentification](#authentification)
- [Gestion des Routes](#gestion-des-routes)
- [Intégration Backend](#intégration-backend)
- [Contribution](#contribution)
- [Licence](#licence)

## 🔍 Vue d'ensemble

Interface utilisateur React moderne pour l'écosystème **Electricity Business**, une plateforme complète de gestion de stations de recharge pour véhicules électriques. Cette application frontend permet aux utilisateurs de :

- **Propriétaires de stations** : Gérer leurs bornes de recharge et lieux
- **Propriétaires de véhicules électriques** : Rechercher et réserver des créneaux de recharge
- **Administrateurs** : Superviser l'ensemble de la plateforme

L'application communique avec l'[API Backend Electricity Business](https://github.com/LaiPe/electricity-business-back) pour offrir une expérience utilisateur fluide et sécurisée.

## 🚀 Technologies

### Frontend Core
- **React 19.1.1** - Bibliothèque JavaScript pour interfaces utilisateur modernes
- **Vite 7.2.4** - Outil de build ultra-rapide et serveur de développement
- **React Router DOM 7.9.5** - Routage côté client avec protection des routes
- **Bootstrap 5.3.8** - Framework CSS pour un design responsive

### Authentification & Sécurité
- **js-cookie 3.0.5** - Gestion des cookies côté client
- **jwt-decode 4.0.0** - Décodage des tokens JWT (lecture seule)

### Développement & Qualité
- **ESLint 9.39.1** - Analyse statique et formatage du code
- **PropTypes 15.8.1** - Validation des propriétés des composants React
- **JavaScript ES6+** - Syntaxe moderne avec modules ES

### Intégration Backend
- **API REST** - Communication avec l'[API Electricity Business](https://github.com/LaiPe/electricity-business-back)
- **Cookies HTTP-only** - Authentification sécurisée sans gestion manuelle des tokens
- **CORS** - Configuration pour environnements de développement et production

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- ✅ **Inscription et connexion utilisateur** avec validation
- ✅ **Authentification JWT sécurisée** via cookies HTTP-only
- ✅ **Vérification d'email** obligatoire
- ✅ **Gestion des sessions** persistantes
- ✅ **Protection des routes** selon les rôles et statuts

### 👥 Gestion des Utilisateurs
- ✅ **Profils utilisateur** complets
- ✅ **Système de rôles** (USER, ADMIN)
- ✅ **Gestion des utilisateurs bannis** et non vérifiés
- ✅ **Tableaux de bord personnalisés**

### 🚗 Gestion des Véhicules
- ✅ **Catalogue de véhicules électriques** avec modèles
- ✅ **Gestion des véhicules personnels**
- ✅ **Caractéristiques techniques** (autonomie, puissance de charge)

### 📍 Stations de Recharge
- ✅ **Recherche géolocalisée** des stations proches
- ✅ **Affichage des disponibilités** en temps réel
- ✅ **Gestion des lieux** de recharge
- ✅ **Interface propriétaire** pour gérer ses stations

### 📅 Système de Réservation
- ✅ **Réservation de créneaux** de recharge
- ✅ **Suivi des réservations** (en cours, terminées, annulées)
- ✅ **Système d'évaluation** post-recharge
- ✅ **Historique complet** des sessions

### 🎨 Interface Utilisateur
- ✅ **Design responsive** avec Bootstrap 5.3.8
- ✅ **Composants réutilisables** et modulaires
- ✅ **Spinners de chargement** adaptatifs
- ✅ **Gestion d'erreurs** avec pages personnalisées
- ✅ **Navigation intuitive** et fluide

## 📁 Structure du Projet

```
src/
├── assets/              # Ressources statiques
│   └── css/            # Styles CSS globaux et variables
├── components/         # Composants réutilisables
│   ├── form/          # Composants de formulaire (Input, Button)
│   └── spinner/       # Composants de chargement
├── config/            # Configuration de l'application
│   └── routes.js      # Définition des permissions de routes
├── contexts/          # Contextes React pour l'état global
│   ├── AuthContext.jsx    # Gestion de l'authentification
│   └── ListContext.jsx    # Gestion des listes partagées
├── hooks/             # Hooks personnalisés
│   ├── useFetch.js         # Hook pour les requêtes API
│   └── useList.js          # Hook pour la gestion des listes
├── layouts/           # Composants de mise en page
│   ├── Header.jsx          # En-tête de navigation
│   └── Footer.jsx          # Pied de page
├── pages/             # Pages de l'application
│   ├── auth/              # Pages d'authentification
│   │   ├── Login.jsx           # Connexion utilisateur
│   │   ├── Register.jsx        # Inscription utilisateur
│   │   └── Verify.jsx          # Vérification d'email
│   ├── navigation/        # Pages de navigation et d'erreur
│   │   ├── ErrorPage.jsx       # Page d'erreur générique
│   │   ├── BannedPage.jsx      # Page pour utilisateurs bannis
│   │   └── UnauthorizedPage.jsx # Page d'accès non autorisé
│   ├── Dashboard.jsx      # Tableau de bord principal
│   ├── Home.jsx          # Page d'accueil
│   ├── PrivacyPolicy.jsx # Politique de confidentialité
│   └── TermsOfService.jsx # Conditions d'utilisation
├── utils/             # Utilitaires et helpers
│   └── ApiRequest.js      # Client API avec gestion d'erreurs
├── main.jsx           # Point d'entrée de l'application
├── Router.jsx         # Configuration du routage
└── RouteGuard.jsx     # Protection et redirection des routes
```

## 🔧 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/LaiPe/electricity-business-front.git
   cd electricity-business-front
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de l'API Backend Electricity Business
VITE_API_URL=http://localhost:8080/api

# Environnement (dev, preprod, prod)
VITE_ENV=dev

# URL du frontend pour CORS (optionnel)
VITE_FRONTEND_URL=http://localhost:5173
```

### Configuration Backend

L'application frontend doit être connectée à l'[API Electricity Business Backend](https://github.com/LaiPe/electricity-business-back). Assurez-vous que :

1. **L'API backend est lancée** (voir documentation backend)
2. **CORS est configuré** pour `localhost:5173` (environnement Vite)
3. **Les cookies sont acceptés** entre frontend et backend

| Variable | Description | Valeur par défaut | Exemples |
|----------|-------------|-------------------|----------|
| `VITE_API_URL` | URL de base de l'API backend | `http://localhost:8080/api` | `https://api.electricity.com/api` |
| `VITE_ENV` | Environnement d'exécution | `dev` | `preprod`, `prod` |
| `VITE_FRONTEND_URL` | URL du frontend pour CORS | `http://localhost:5173` | `https://app.electricity.com` |

### Configuration de développement

Pour le développement local, le backend doit être lancé avec le profil `dev` :

```bash
# Dans le projet backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

## 📝 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview

# Lancer le linting
npm run lint
```

## 🏗️ Architecture

### Contextes React

- **AuthContext** : Gestion de l'état d'authentification global
- **ListContext** : Gestion des listes et données partagées

### Hooks Personnalisés

- **useFetch** : Hook pour les requêtes API
- **useList** : Hook pour la gestion des listes

### Composants Clés

- **RouteGuard** : Protection et redirection des routes
- **ApiRequest** : Utilitaire pour les requêtes API avec gestion d'erreurs

## 🔐 Authentification

L'application utilise le système d'authentification de l'API Backend avec des **cookies HTTP-only sécurisés** :

### 🔄 Flux d'Authentification

1. **Inscription** (`POST /api/auth/register`)
   - Création du compte utilisateur
   - Envoi d'email de vérification
   - Redirection vers page de vérification

2. **Connexion** (`POST /api/auth/login`)
   - Validation des identifiants
   - Génération du token JWT stocké en cookie HTTP-only
   - Récupération des informations utilisateur

3. **Vérification du statut** (`GET /api/auth/status`)
   - Validation automatique du token au chargement
   - Récupération des données utilisateur à jour
   - Gestion des sessions expirées

4. **Déconnexion** (`POST /api/auth/logout`)
   - Invalidation du token côté serveur
   - Suppression du cookie
   - Nettoyage de l'état local

### 👤 États Utilisateur

| État | Description | Accès autorisé |
|------|-------------|----------------|
| **Anonyme** | Utilisateur non connecté | Routes publiques uniquement |
| **Non vérifié** | Connecté mais email non confirmé | Pages de vérification + logout |
| **Vérifié** | Compte complet et actif | Toutes les fonctionnalités utilisateur |
| **Banni** | Compte suspendu | Accès très restreint |
| **Admin** | Privilèges administrateur | Accès complet + gestion utilisateurs |

### 🛡️ Sécurité

- **Cookies HTTP-only** : Protection contre les attaques XSS
- **Validation automatique** : Vérification du token à chaque requête
- **Expiration gérée** : Renouvellement automatique des sessions
- **Protection CSRF** : Configuration CORS stricte

## 🛣️ Gestion des Routes

Le système de routes est organisé par **niveaux de permission** selon le statut et le rôle de l'utilisateur :

### 🌐 Routes Publiques
Accessibles à tous les utilisateurs (connectés ou non) :
- `/` - Page d'accueil de la plateforme
- `/login` - Connexion utilisateur
- `/register` - Inscription utilisateur
- `/privacy-policy` - Politique de confidentialité
- `/terms-of-service` - Conditions générales d'utilisation

### 🔓 Routes Utilisateur Non Vérifié
Utilisateurs connectés mais email non confirmé :
- `/verify` - Page de vérification d'email
- `/logout` - Déconnexion

### ✅ Routes Utilisateur Vérifié
Utilisateurs avec compte complet et actif :
- `/dashboard` - Tableau de bord principal
- `/profile` - Gestion du profil utilisateur
- `/vehicles` - Gestion des véhicules
- `/stations` - Recherche et réservation de stations
- `/bookings` - Historique des réservations
- `/my-stations` - Gestion des stations personnelles (propriétaires)

### 🚫 Routes Utilisateur Banni
Utilisateurs avec compte suspendu :
- Routes publiques + `/banned` - Page d'information de suspension
- `/logout` - Déconnexion autorisée

### 👑 Routes Administrateur
Accès complet pour les administrateurs :
- Toutes les routes utilisateur +
- `/admin/*` - Interface d'administration
- `/admin/users` - Gestion des utilisateurs
- `/admin/stations` - Supervision des stations
- `/admin/bookings` - Supervision des réservations

### 🛡️ Protection des Routes

Le composant `RouteGuard` effectue automatiquement :
1. **Vérification de l'authentification** avant chaque navigation
2. **Contrôle des permissions** selon le rôle et statut
3. **Redirections automatiques** vers les pages appropriées
4. **Gestion des cas d'erreur** (utilisateur banni, non vérifié, etc.)

## 🔗 Intégration Backend

Cette application frontend est étroitement intégrée avec l'[**API Electricity Business Backend**](https://github.com/LaiPe/electricity-business-back) pour offrir une expérience utilisateur complète.

### 📡 Endpoints Consommés

L'application communique avec les endpoints suivants :

| Endpoint | Usage | Description |
|----------|--------|-------------|
| `/api/auth/*` | Authentification | Login, register, logout, vérification de statut |
| `/api/users/*` | Gestion utilisateur | Profils, informations personnelles |
| `/api/vehicles/*` | Véhicules | Catalogue de modèles, véhicules personnels |
| `/api/places/*` | Lieux | Gestion des lieux de recharge |
| `/api/stations/*` | Stations | Recherche, disponibilité, géolocalisation |
| `/api/bookings/*` | Réservations | Création, suivi, évaluation des sessions |

### 🔄 Communication API

**Client API Personnalisé** (`utils/ApiRequest.js`) :
```javascript
// Configuration automatique pour toutes les requêtes
- Content-Type: application/json
- Credentials: include (cookies automatiques)
- Gestion centralisée des erreurs HTTP
- Support des codes de statut métier
```

**Fonctionnalités intégrées** :
- ✅ **Authentification transparente** via cookies HTTP-only
- ✅ **Gestion d'erreurs standardisée** avec messages utilisateur
- ✅ **Retry automatique** pour les requêtes échouées
- ✅ **Loading states** synchronisés avec l'UI
- ✅ **CORS configuré** pour les environnements dev/prod

### 🌐 Compatibilité Environnements

| Environnement | Backend URL | Frontend URL | Configuration |
|---------------|-------------|--------------|---------------|
| **Développement** | `localhost:8080` | `localhost:5173` | CORS local, H2 + MongoDB |
| **Pré-production** | `preprod-api.url` | `preprod-app.url` | Docker Compose |
| **Production** | `api.electricity.com` | `app.electricity.com` | Docker + Registry |

### 🔧 Configuration Backend Requise

Pour un fonctionnement optimal, assurez-vous que le backend a :

1. **CORS configuré** pour votre URL frontend
2. **Profile approprié** lancé (dev/preprod/prod)
3. **Bases de données** disponibles (MySQL + MongoDB)
4. **Variables d'environnement** correctement définies

Voir la [documentation backend](https://github.com/LaiPe/electricity-business-back) pour les détails de configuration.

## 🤝 Contribution

1. **Fork** le projet depuis GitHub
2. **Créer une branche** feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Développer** en suivant les standards du projet
4. **Tester** les modifications localement
5. **Commit** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
6. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
7. **Ouvrir une Pull Request** avec description détaillée

### 📋 Standards de Développement

#### Code Quality
- **ESLint** : Respecter les règles de linting configurées
- **PropTypes** : Valider les props de tous les composants
- **Naming** : Utiliser des noms explicites et cohérents
- **Comments** : Documenter la logique complexe

#### Structure des Composants
```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MonComposant = ({ proprieteRequise, proprieteOptionnelle = "default" }) => {
  // Hooks en premier
  const [state, setState] = useState(null);
  
  // Logique métier
  useEffect(() => {
    // Side effects
  }, []);

  // Render
  return (
    <div className="mon-composant">
      {/* JSX content */}
    </div>
  );
};

MonComposant.propTypes = {
  proprieteRequise: PropTypes.string.isRequired,
  proprieteOptionnelle: PropTypes.string
};

export default MonComposant;
```

#### Gestion des Erreurs
- **Try/catch** pour toutes les requêtes API
- **Fallback UI** pour les composants critiques
- **Messages utilisateur** explicites et traduits
- **Logging** approprié en développement

### 🧪 Tests et Validation

Avant de soumettre une PR :
```bash
# Vérification de la qualité du code
npm run lint

# Build de production
npm run build

# Test de l'application
npm run preview
```

### 🔗 Intégration avec le Backend

Lors du développement de nouvelles fonctionnalités :
1. **Consulter** la [documentation des endpoints](https://github.com/LaiPe/electricity-business-back/blob/main/ENDPOINTS.md)
2. **Tester** avec le backend en mode dev
3. **Valider** l'authentification et les permissions
4. **Vérifier** la gestion d'erreurs API

## 📞 Support & Documentation

### 📚 Documentation Complète

| Ressource | Description | Lien |
|-----------|-------------|------|
| **Backend API** | Documentation complète de l'API | [electricity-business-back](https://github.com/LaiPe/electricity-business-back) |
| **Endpoints** | Détails des endpoints disponibles | [ENDPOINTS.md](https://github.com/LaiPe/electricity-business-back/blob/main/ENDPOINTS.md) |
| **Environnements** | Configuration backend par environnement | [ENVIRONNEMENTS.md](https://github.com/LaiPe/electricity-business-back/blob/main/ENVIRONNEMENTS.md) |

### 🆘 Aide et Support

**Pour les problèmes techniques :**
1. **Vérifier les logs** de la console navigateur (`F12`)
2. **Consulter le statut** de l'API backend (`/api/auth/status`)
3. **Valider la configuration** des variables d'environnement
4. **Ouvrir une issue** sur GitHub avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Logs d'erreur
   - Environnement (dev/preprod/prod)

**Pour les questions de développement :**
- Consulter la [documentation des endpoints](https://github.com/LaiPe/electricity-business-back/blob/main/ENDPOINTS.md)
- Vérifier l'architecture dans ce README
- Examiner les exemples de code dans les composants existants

### 🐛 Debugging

**Outils de débogage disponibles :**
```javascript
// Logs d'authentification
console.log('Auth status:', useAuth());

// Inspection des requêtes API
// Ouvrir les DevTools > Network pour voir les requêtes

// Variables d'environnement
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Problèmes courants :**
- **CORS Error** → Vérifier que le backend autorise votre URL frontend
- **401 Unauthorized** → Token expiré, se reconnecter
- **Network Error** → Backend non démarré ou URL incorrecte
- **403 Forbidden** → Permissions insuffisantes pour cette route

## 📄 Licence

Ce projet est sous **licence MIT**. Voir le fichier `LICENSE` pour plus de détails.

### Projets Liés
- [**Backend API**](https://github.com/LaiPe/electricity-business-back) - API Spring Boot pour la gestion des stations de recharge

---

**Développé avec ❤️ par [LaiPe](https://github.com/LaiPe) pour la révolution de la mobilité électrique**
