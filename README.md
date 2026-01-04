# ⚡ Electricity Business - Frontend

**Interface utilisateur moderne pour la gestion de stations de recharge électrique**

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?logo=vite)
![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.14.0-orange?logo=maplibre)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple?logo=bootstrap)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-1.13.1-purple?logo=bootstrap)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Nginx](https://img.shields.io/badge/Nginx-Alpine-green?logo=nginx)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies et Dépendances](#technologies-et-dépendances)
- [APIs et Intégrations](#apis-et-intégrations)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Déploiement Docker](#déploiement-docker)
- [Scripts Disponibles](#scripts-disponibles)
- [Architecture](#architecture)
- [Authentification](#authentification)
- [Gestion des Routes](#gestion-des-routes)
- [Intégration Backend](#intégration-backend)
- [Contribution](#contribution)
- [Licence](#licence)

## 🔍 Vue d'ensemble

Interface utilisateur React moderne pour l'écosystème **Electricity Business**, une plateforme complète de gestion de stations de recharge pour véhicules électriques. Cette application frontend permet aux utilisateurs de :

- **Propriétaires de stations** : Gérer leurs bornes de recharge, lieux et réservations
- **Propriétaires de véhicules électriques** : Rechercher, localiser et réserver des créneaux de recharge
- **Administrateurs** : Superviser l'ensemble de la plateforme

L'application communique avec l'[API Backend Electricity Business](https://github.com/LaiPe/electricity-business-back) pour offrir une expérience utilisateur fluide et sécurisée.

## 🚀 Technologies et Dépendances

### 📦 Dépendances de Production

#### Frontend Core
| Package | Version | Description |
|---------|---------|-------------|
| **react** | `^19.1.1` | Bibliothèque JavaScript pour interfaces utilisateur modernes avec Concurrent Mode |
| **react-dom** | `^19.1.1` | Rendu DOM optimisé pour React 19 |
| **react-router-dom** | `^7.9.5` | Routage côté client avec protection des routes, nested routes et data loading |

#### Cartographie & Géolocalisation
| Package | Version | Description |
|---------|---------|-------------|
| **maplibre-gl** | `^5.14.0` | Moteur de rendu cartographique WebGL open-source (fork libre de Mapbox GL) |
| **react-map-gl** | `^8.1.0` | Wrapper React pour MapLibre GL avec composants déclaratifs |

#### Interface Utilisateur
| Package | Version | Description |
|---------|---------|-------------|
| **bootstrap** | `5.3.8` | Framework CSS responsive (chargé via CDN jsdelivr) |
| **bootstrap-icons** | `^1.13.1` | Bibliothèque d'icônes SVG Bootstrap (2000+ icônes) |

#### Authentification & Sécurité
| Package | Version | Description |
|---------|---------|-------------|
| **js-cookie** | `^3.0.5` | Gestion légère des cookies côté client (2KB gzippé) |
| **jwt-decode** | `^4.0.0` | Décodage des tokens JWT (lecture seule, sans validation) |

#### Validation & Types
| Package | Version | Description |
|---------|---------|-------------|
| **prop-types** | `^15.8.1` | Validation runtime des props des composants React |

### 🛠️ Dépendances de Développement

#### Build & Bundling
| Package | Version | Description |
|---------|---------|-------------|
| **vite** | `^7.2.4` | Outil de build ultra-rapide basé sur ESBuild et Rollup |
| **@vitejs/plugin-react** | `^5.1.1` | Plugin Vite pour support React (Fast Refresh, JSX transform) |

#### Qualité de Code
| Package | Version | Description |
|---------|---------|-------------|
| **eslint** | `^9.39.1` | Linter JavaScript/TypeScript configurable |
| **@eslint/js** | `^9.39.1` | Configuration ESLint officielle pour JavaScript |
| **eslint-plugin-react-hooks** | `^7.0.1` | Règles ESLint pour les React Hooks |
| **eslint-plugin-react-refresh** | `^0.4.24` | Validation des exports pour React Fast Refresh |
| **globals** | `^16.5.0` | Définitions des variables globales pour ESLint |

#### Types TypeScript (IntelliSense)
| Package | Version | Description |
|---------|---------|-------------|
| **@types/react** | `^19.2.5` | Définitions TypeScript pour React (autocomplétion IDE) |
| **@types/react-dom** | `^19.2.3` | Définitions TypeScript pour React DOM |

### 🐳 Infrastructure & Déploiement

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Docker** | Multi-stage | Build optimisé avec Node.js 18 Alpine + Nginx Alpine |
| **Nginx** | Alpine | Serveur web haute performance pour SPA |
| **Node.js** | 18 Alpine | Runtime JavaScript pour le build |

### 🌐 Standards Web

| Technologie | Description |
|-------------|-------------|
| **ES Modules** | Modules JavaScript natifs (`type: "module"`) |
| **JavaScript ES6+** | Syntaxe moderne (async/await, destructuring, spread, etc.) |
| **CSS3** | Styles modernes avec variables CSS |
| **HTML5** | Structure sémantique et APIs modernes |
| **Fetch API** | Requêtes HTTP natives avec gestion des credentials |
| **Geolocation API** | API native de géolocalisation du navigateur |
| **WebGL** | Rendu cartographique accéléré par GPU |

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- ✅ **Inscription et connexion utilisateur** avec validation complète
- ✅ **Authentification JWT sécurisée** via cookies HTTP-only
- ✅ **Vérification d'email** obligatoire avant accès complet
- ✅ **Gestion des sessions** persistantes avec renouvellement automatique
- ✅ **Protection des routes** selon les rôles et statuts utilisateur
- ✅ **Gestion des erreurs globales** avec contexte dédié

### 👥 Gestion des Utilisateurs
- ✅ **Profils utilisateur** publics et privés
- ✅ **Système de rôles** (USER, ADMIN)
- ✅ **Gestion des utilisateurs bannis** avec pages dédiées
- ✅ **Tableaux de bord personnalisés** selon le contexte

### 🚗 Gestion des Véhicules
- ✅ **Catalogue de véhicules électriques** avec recherche de modèles
- ✅ **Gestion des véhicules personnels** (CRUD complet)
- ✅ **Caractéristiques techniques** (autonomie, puissance de charge)
- ✅ **Recherche intelligente** des modèles avec autocomplétion

### 📍 Stations de Recharge & Cartographie
- ✅ **Carte interactive MapLibre GL** avec rendu WebGL
- ✅ **Recherche géolocalisée** des stations proches en temps réel
- ✅ **Clustering dynamique** des marqueurs selon le niveau de zoom
- ✅ **Géocodage direct et inverse** via APIs externes
- ✅ **Popups enrichis** avec adresses et liens Google Maps
- ✅ **Gestion des lieux** de recharge (places) avec coordonnées GPS
- ✅ **Interface propriétaire** complète pour gérer ses stations
- ✅ **Contrôles de zoom** personnalisés et bouton de géolocalisation

### 📅 Système de Réservation
- ✅ **Réservation de créneaux** de recharge avec sélection de dates
- ✅ **Calendrier visuel** des réservations avec vue mensuelle
- ✅ **Double vue** propriétaire véhicule / propriétaire station
- ✅ **Workflow complet** : pending → accepted → ongoing → completed
- ✅ **Actions contextuelles** : accepter, refuser, annuler, démarrer, terminer
- ✅ **Export PDF** des réservations individuelles
- ✅ **Export Excel** de l'historique complet
- ✅ **Système d'évaluation** post-recharge

### 🎨 Interface Utilisateur
- ✅ **Design responsive** avec breakpoints mobile/tablet/desktop
- ✅ **Composants réutilisables** et modulaires (Form, Spinner, Map)
- ✅ **Spinners de chargement** adaptatifs avec messages contextuels
- ✅ **Gestion d'erreurs** avec pages personnalisées (Error, Banned, Unauthorized)
- ✅ **Navigation intuitive** avec header et footer persistants
- ✅ **Dashboard multi-sections** (Overview, Bookings, Vehicles, Stations)
- ✅ **Filtres de date** pour les réservations
- ✅ **Modales** de localisation de station

## 🔌 APIs et Intégrations

### 🌍 APIs Externes (Tierces)

L'application consomme plusieurs APIs externes pour enrichir l'expérience utilisateur :

#### OpenStreetMap Nominatim
| Endpoint | Usage | Description |
|----------|-------|-------------|
| `https://nominatim.openstreetmap.org/search` | Géocodage | Convertit une adresse textuelle en coordonnées GPS |

**Paramètres utilisés :**
- `format=json` - Format de réponse JSON
- `q={address}` - Adresse encodée URL
- `limit=1` - Limite à un résultat
- `addressdetails=1` - Détails d'adresse complets

**Exemple d'appel :**
```javascript
const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
);
```

#### Photon (Komoot)
| Endpoint | Usage | Description |
|----------|-------|-------------|
| `https://photon.komoot.io/reverse` | Géocodage inverse | Convertit des coordonnées GPS en adresse lisible |

**Paramètres utilisés :**
- `lon={longitude}` - Longitude WGS84
- `lat={latitude}` - Latitude WGS84

**Exemple d'appel :**
```javascript
const response = await fetch(
    `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`
);
```

**Données retournées :**
- `housenumber` - Numéro de rue
- `street` - Nom de la rue
- `city` - Ville
- `postcode` - Code postal
- `country` - Pays
- `state` - Région/État

#### Google Maps (Liens externes)
| Usage | Description |
|-------|-------------|
| `https://www.google.com/maps?q={lat},{lng}` | Navigation externe vers Google Maps |

### 🗺️ Services Cartographiques

#### MapLibre GL JS
| Service | Description |
|---------|-------------|
| **Tiles OpenStreetMap** | Tuiles vectorielles gratuites pour le rendu cartographique |
| **Style Carto Voyager** | Thème cartographique par défaut (`https://basemaps.cartocdn.com`) |

**Configuration MapLibre :**
```jsx
<Map
    ref={mapRef}
    mapLib={import('maplibre-gl')}
    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    // ...
/>
```

#### Geolocation API (Native Browser)
| Méthode | Description |
|---------|-------------|
| `navigator.geolocation.getCurrentPosition()` | Obtention de la position GPS de l'utilisateur |

**Options de configuration :**
```javascript
const options = {
    enableHighAccuracy: true,  // GPS haute précision
    timeout: 10000,            // Timeout 10 secondes
    maximumAge: 60000          // Cache position 1 minute
};
```

### 🔗 API Interne (Backend Electricity Business)

L'application communique avec l'[API Backend](https://github.com/LaiPe/electricity-business-back) via un client HTTP centralisé (`utils/ApiRequest.js`).

#### Configuration du Client API

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Cookies HTTP-only automatiques
};
```

#### Endpoints Authentification (`/api/auth/*`)

| Méthode | Endpoint | Service | Description |
|---------|----------|---------|-------------|
| `POST` | `/auth/register` | `AuthContext` | Inscription utilisateur |
| `POST` | `/auth/login` | `AuthContext` | Connexion utilisateur |
| `POST` | `/auth/logout` | `AuthContext` | Déconnexion utilisateur |
| `GET` | `/auth/status` | `AuthContext` | Vérification du statut de session |

#### Endpoints Utilisateurs (`/api/users/*`)

| Méthode | Endpoint | Service | Description |
|---------|----------|---------|-------------|
| `GET` | `/users/{id}/public` | `UserService` | Récupération du profil public |

#### Endpoints Véhicules (`/api/vehicles/*`)

| Méthode | Endpoint | Service | Description |
|---------|----------|---------|-------------|
| `GET` | `/vehicles` | `VehicleService` | Liste des véhicules de l'utilisateur |
| `GET` | `/vehicles/{id}` | `VehicleService` | Détails d'un véhicule |
| `POST` | `/vehicles` | `VehicleService` | Ajout d'un véhicule |
| `PUT` | `/vehicles/{id}` | `VehicleService` | Modification d'un véhicule |
| `DELETE` | `/vehicles/{id}` | `VehicleService` | Suppression d'un véhicule |
| `GET` | `/vehicles/models` | `VehicleService` | Catalogue complet des modèles |
| `GET` | `/vehicles/models/search?q={query}` | `VehicleService` | Recherche de modèles |

#### Endpoints Lieux (`/api/places/*`)

| Méthode | Endpoint | Service | Description |
|---------|----------|---------|-------------|
| `GET` | `/places` | `StationService` | Liste des lieux de l'utilisateur avec stations |
| `POST` | `/places` | `StationService` | Création d'un lieu |
| `PUT` | `/places/{id}` | `StationService` | Modification d'un lieu |
| `DELETE` | `/places/{id}` | `StationService` | Suppression d'un lieu |

#### Endpoints Stations (`/api/stations/*`)

| Méthode | Endpoint | Service | Description |
|---------|----------|---------|-------------|
| `GET` | `/stations/nearby?latitude={lat}&longitude={lng}&radius_in_km={km}` | `StationService` | Stations proches |
| `GET` | `/stations/nearby-and-free?latitude={lat}&longitude={lng}&radius_in_km={km}&search_start={start}&search_end={end}` | `StationService` | Stations disponibles |
| `POST` | `/stations` | `StationService` | Création d'une station |
| `PUT` | `/stations/{id}` | `StationService` | Modification d'une station |
| `DELETE` | `/stations/{id}` | `StationService` | Suppression d'une station |

#### Endpoints Réservations (`/api/bookings/*`)

| Méthode | Endpoint | Service | Description |
|---------|----------|---------|-------------|
| `GET` | `/bookings/as-vehicle-owner` | `BookingService` | Réservations en tant que client |
| `GET` | `/bookings/as-station-owner` | `BookingService` | Réservations en tant que propriétaire |
| `POST` | `/bookings` | `BookingService` | Création d'une réservation |
| `PATCH` | `/bookings/{id}/accept` | `BookingService` | Acceptation d'une réservation |
| `PATCH` | `/bookings/{id}/reject` | `BookingService` | Refus d'une réservation |
| `PATCH` | `/bookings/{id}/cancel` | `BookingService` | Annulation d'une réservation |
| `PATCH` | `/bookings/{id}/start` | `BookingService` | Démarrage d'une session de charge |
| `PATCH` | `/bookings/{id}/end` | `BookingService` | Fin d'une session de charge |
| `PATCH` | `/bookings/{id}/review` | `BookingService` | Évaluation d'une réservation |
| `GET` | `/bookings/{id}/export/pdf` | `BookingService` | Export PDF d'une réservation |
| `GET` | `/bookings/export/xlsx` | `BookingService` | Export Excel de toutes les réservations |

### 📊 Formats de Réponse Supportés

| Content-Type | Usage | Gestion |
|--------------|-------|---------|
| `application/json` | Données API | `response.json()` |
| `application/pdf` | Export PDF | `response.blob()` |
| `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Export Excel | `response.blob()` |
| `application/octet-stream` | Fichiers binaires | `response.blob()` |

## 📁 Structure du Projet

```
electricity-business-front/
├── docker-compose.yml         # Configuration Docker Compose (développement)
├── docker-compose.prod.yml    # Configuration Docker Compose (production)
├── Dockerfile                 # Build multi-stage Node.js + Nginx
├── nginx.conf                 # Configuration serveur Nginx pour SPA
├── eslint.config.js           # Configuration ESLint
├── vite.config.js             # Configuration Vite
├── package.json               # Dépendances et scripts
├── index.html                 # Point d'entrée HTML
├── public/                    # Assets statiques publics
└── src/
    ├── main.jsx               # Point d'entrée React
    ├── Router.jsx             # Configuration du routage React Router
    ├── RouteGuard.jsx         # Protection et redirection des routes
    ├── assets/
    │   └── css/
    │       ├── globals.css        # Styles CSS globaux
    │       └── pages/             # Styles spécifiques aux pages
    ├── components/
    │   ├── dashboard/
    │   │   ├── booking/
    │   │   │   ├── DateRangeFilter.jsx       # Filtre de plage de dates
    │   │   │   ├── DualBookingView.jsx       # Vue double (véhicule/station)
    │   │   │   ├── GenericBookingTable.jsx   # Tableau générique de réservations
    │   │   │   └── StationLocationModal.jsx  # Modal de localisation
    │   │   ├── calendar/
    │   │   │   ├── BookingCalendar.jsx       # Calendrier des réservations
    │   │   │   └── BookingCalendar.css       # Styles du calendrier
    │   │   ├── station/
    │   │   │   ├── AddPlaceForm.jsx          # Formulaire d'ajout de lieu
    │   │   │   ├── AddStationForm.jsx        # Formulaire d'ajout de station
    │   │   │   ├── PlaceCard.jsx             # Carte d'affichage d'un lieu
    │   │   │   ├── PlaceList.jsx             # Liste des lieux
    │   │   │   ├── StationItem.jsx           # Élément station
    │   │   │   ├── UpdatePlaceForm.jsx       # Formulaire de modification de lieu
    │   │   │   └── UpdateStationForm.jsx     # Formulaire de modification de station
    │   │   └── vehicle/
    │   │       ├── AddVehicleForm.jsx        # Formulaire d'ajout de véhicule
    │   │       ├── UpdateVehicleForm.jsx     # Formulaire de modification
    │   │       ├── VehicleItem.jsx           # Élément véhicule
    │   │       ├── VehicleList.jsx           # Liste des véhicules
    │   │       └── VehicleModelSearchInput.jsx # Recherche de modèles
    │   ├── form/
    │   │   ├── Button.jsx                    # Bouton stylisé réutilisable
    │   │   ├── GeolocationButton.jsx         # Bouton de géolocalisation
    │   │   ├── Input.jsx                     # Champ de saisie stylisé
    │   │   ├── MapCoordinateInput.jsx        # Sélecteur de coordonnées sur carte
    │   │   ├── SearchInput.jsx               # Champ de recherche
    │   │   └── ToggleSwitch.jsx              # Interrupteur toggle
    │   ├── home/hero/
    │   │   ├── HeroMap.jsx                   # Carte interactive hero
    │   │   ├── HeroMap.css                   # Styles de la carte hero
    │   │   └── HeroSearchForm.jsx            # Formulaire de recherche hero
    │   ├── map/
    │   │   ├── ClusterMarker.jsx             # Marqueur de cluster
    │   │   ├── StationMarker.jsx             # Marqueur de station
    │   │   ├── StationPopup.jsx              # Popup d'information station
    │   │   └── ZoomControl.jsx               # Contrôles de zoom
    │   ├── search/
    │   │   └── SearchForm.jsx                # Formulaire de recherche avancée
    │   └── spinner/
    │       ├── Spinner.jsx                   # Composant de chargement
    │       └── Spinner.module.css            # Styles CSS Modules
    ├── config/
    │   └── routes.js                         # Configuration des permissions de routes
    ├── contexts/
    │   ├── AuthContext.jsx                   # Contexte d'authentification global
    │   ├── BookingsContext.jsx               # Contexte de gestion des réservations
    │   ├── GlobalErrorContext.jsx            # Contexte de gestion des erreurs
    │   └── ListContext.jsx                   # Contexte de listes partagées
    ├── hooks/
    │   ├── useApiCall.js                     # Hook pour appels API avec gestion d'erreurs
    │   ├── useFetch.js                       # Hook fetch générique
    │   ├── useGeolocation.js                 # Hook de géolocalisation native
    │   ├── useList.js                        # Hook de gestion de listes
    │   ├── useStationAddress.js              # Hook d'enrichissement d'adresses
    │   └── useViewport.js                    # Hook de détection responsive
    ├── layouts/
    │   ├── DashboardLayout.jsx               # Layout du tableau de bord
    │   ├── Footer.jsx                        # Pied de page
    │   └── Header.jsx                        # En-tête de navigation
    ├── pages/
    │   ├── BookingCreate.jsx                 # Création de réservation
    │   ├── Home.jsx                          # Page d'accueil
    │   ├── PrivacyPolicy.jsx                 # Politique de confidentialité
    │   ├── Search.jsx                        # Page de recherche
    │   ├── TermsOfService.jsx                # Conditions d'utilisation
    │   ├── auth/
    │   │   ├── Login.jsx                     # Page de connexion
    │   │   ├── Register.jsx                  # Page d'inscription
    │   │   └── Verify.jsx                    # Page de vérification email
    │   ├── dashboard/
    │   │   ├── Bookings.jsx                  # Gestion des réservations
    │   │   ├── Overview.jsx                  # Vue d'ensemble dashboard
    │   │   ├── Stations.jsx                  # Gestion des stations
    │   │   └── Vehicles.jsx                  # Gestion des véhicules
    │   └── navigation/
    │       ├── BannedPage.jsx                # Page utilisateur banni
    │       ├── ErrorPage.jsx                 # Page d'erreur générique
    │       └── UnauthorizedPage.jsx          # Page accès non autorisé
    ├── services/
    │   ├── BookingService.js                 # Service API réservations
    │   ├── GeoService.js                     # Service géocodage externe
    │   ├── StationService.js                 # Service API stations/lieux
    │   ├── UserService.js                    # Service API utilisateurs
    │   └── VehicleService.js                 # Service API véhicules
    └── utils/
        ├── ApiRequest.js                     # Client HTTP centralisé
        ├── DateUtils.js                      # Utilitaires de formatage de dates
        └── MapUtils.js                       # Utilitaires cartographiques (Haversine, bounds)
```

## 🔧 Installation

### Prérequis

| Outil | Version | Description |
|-------|---------|-------------|
| **Node.js** | ≥ 18.x | Runtime JavaScript (recommandé : LTS) |
| **npm** | ≥ 9.x | Gestionnaire de paquets (inclus avec Node.js) |
| **Git** | ≥ 2.x | Système de contrôle de version |
| **Docker** | ≥ 20.x | (Optionnel) Conteneurisation |
| **Docker Compose** | ≥ 2.x | (Optionnel) Orchestration de conteneurs |

### Installation Locale

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
   # Éditer .env avec vos valeurs
   ```

4. **Lancer en mode développement**
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   - Ouvrir http://localhost:5173 dans votre navigateur

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

### Tableau des Variables

| Variable | Description | Valeur par défaut | Exemples |
|----------|-------------|-------------------|----------|
| `VITE_API_URL` | URL de base de l'API backend | `http://localhost:8080/api` | `https://api.electricity.com/api` |
| `VITE_ENV` | Environnement d'exécution | `dev` | `preprod`, `prod` |
| `VITE_FRONTEND_URL` | URL du frontend pour CORS | `http://localhost:5173` | `https://app.electricity.com` |

### Configuration Backend

L'application frontend doit être connectée à l'[API Electricity Business Backend](https://github.com/LaiPe/electricity-business-back). Assurez-vous que :

1. **L'API backend est lancée** (voir documentation backend)
2. **CORS est configuré** pour `localhost:5173` (environnement Vite)
3. **Les cookies sont acceptés** entre frontend et backend

### Configuration de développement

Pour le développement local, le backend doit être lancé avec le profil `dev` :

```bash
# Dans le projet backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

## 🐳 Déploiement Docker

### Build Multi-Stage

Le Dockerfile utilise un build multi-stage optimisé :

```dockerfile
# Étape 1: Build avec Node.js 18 Alpine
FROM node:18-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2: Serveur Nginx Alpine
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
```

### Configuration Nginx

La configuration Nginx inclut :

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Routing SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache long terme pour assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### Docker Compose

**Développement :**
```bash
docker-compose up --build
```

**Production :**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Configuration Docker Compose

```yaml
services:
  electricity-business:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=https://electricity-business.leopeyronnet.fr/api
    container_name: electricity-business
    ports:
      - "3000:80"
    networks:
      - electricity_business_api_external
    restart: unless-stopped

networks:
  electricity_business_api_external:
    external: true
```

## 📝 Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **dev** | `npm run dev` | Démarre le serveur de développement Vite avec HMR |
| **build** | `npm run build` | Compile l'application pour la production |
| **preview** | `npm run preview` | Prévisualise le build de production localement |
| **lint** | `npm run lint` | Analyse le code avec ESLint |

### Détails des Scripts

```bash
# Démarrer le serveur de développement (HMR activé)
npm run dev
# → http://localhost:5173

# Construire pour la production
npm run build
# → Génère le dossier dist/

# Prévisualiser la build de production
npm run preview
# → http://localhost:4173

# Lancer le linting ESLint
npm run lint
# → Analyse tous les fichiers .js/.jsx
```

## 🏗️ Architecture

### 🔄 Flux de Données

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Router.jsx                            │    │
│  │  ┌─────────────────────────────────────────────────────┐│    │
│  │  │              GlobalErrorProvider                    ││    │
│  │  │  ┌─────────────────────────────────────────────────┐││    │
│  │  │  │               AuthProvider                      │││    │
│  │  │  │  ┌─────────────────────────────────────────────┐│││    │
│  │  │  │  │            RouteGuard                       ││││    │
│  │  │  │  │  ┌─────────────────────────────────────────┐││││    │
│  │  │  │  │  │    Pages / Layouts / Components         │││││    │
│  │  │  │  │  └─────────────────────────────────────────┘││││    │
│  │  │  │  └─────────────────────────────────────────────┘│││    │
│  │  │  └─────────────────────────────────────────────────┘││    │
│  │  └─────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                        Services Layer                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ BookingService│ │StationService│ │VehicleService│             │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘             │
│         │                │                │                      │
│  ┌──────┴────────────────┴────────────────┴───────┐             │
│  │              ApiRequest.js (Client HTTP)        │             │
│  └────────────────────────┬───────────────────────┘             │
│                           │                                      │
├───────────────────────────┼─────────────────────────────────────┤
│                           ▼                                      │
│              Backend API (Spring Boot)                          │
└─────────────────────────────────────────────────────────────────┘
```

### 📦 Contextes React

| Contexte | Fichier | Responsabilité |
|----------|---------|----------------|
| **AuthContext** | `AuthContext.jsx` | État d'authentification, login, logout, register, checkAuthStatus |
| **GlobalErrorContext** | `GlobalErrorContext.jsx` | Gestion centralisée des erreurs avec affichage global |
| **BookingsContext** | `BookingsContext.jsx` | État des réservations avec reducers (VehicleOwner/StationOwner) |
| **ListContext** | `ListContext.jsx` | Gestion des listes partagées avec useReducer |

### 🪝 Hooks Personnalisés

| Hook | Fichier | Description |
|------|---------|-------------|
| **useApiCall** | `useApiCall.js` | Appels API avec gestion des erreurs globales et vérification auth |
| **useFetch** | `useFetch.js` | Hook fetch générique avec loading/error/data |
| **useGeolocation** | `useGeolocation.js` | Accès à l'API Geolocation native avec fallback Paris |
| **useList** | `useList.js` | Gestion CRUD de listes avec useReducer |
| **useStationAddress** | `useStationAddress.js` | Enrichissement des stations avec géocodage inverse |
| **useViewport** | `useViewport.js` | Détection responsive (mobile/tablet/desktop) |

### 🛠️ Utilitaires

| Utilitaire | Fichier | Fonctions |
|------------|---------|-----------|
| **ApiRequest** | `ApiRequest.js` | `apiRequest(endpoint, method, body)` - Client HTTP centralisé |
| **DateUtils** | `DateUtils.js` | `formatDate(date)` - Formatage ISO sans UTC |
| **MapUtils** | `MapUtils.js` | `calculateVisibleRadius()`, `createStationBoundsFilter()`, `debounce()`, `calculatePixelDistance()` |

### 🗺️ Utilitaires Cartographiques (MapUtils.js)

| Fonction | Description |
|----------|-------------|
| `calculateVisibleRadius(mapRef)` | Calcule le rayon visible en km avec formule de Haversine |
| `calculateVisibleRadiusByZoom(zoom, lat, width)` | Calcule le rayon via projection de Mercator |
| `createStationBoundsFilter(mapRef)` | Crée un callback filter pour les stations dans les bounds |
| `calculatePixelDistance(lat1, lng1, lat2, lng2, mapRef)` | Distance en pixels entre deux points |
| `debounce(func, wait)` | Debounce pour optimiser les appels fréquents |

## 🔐 Authentification

L'application utilise le système d'authentification de l'API Backend avec des **cookies HTTP-only sécurisés** :

### 🔄 Flux d'Authentification

```
┌─────────────┐     POST /auth/register     ┌──────────────┐
│  Register   │ ─────────────────────────── │   Backend    │
│    Page     │ ←─── Set-Cookie: JWT ────── │     API      │
└─────────────┘                             └──────────────┘
       │
       ▼
┌─────────────┐     GET /auth/status        ┌──────────────┐
│   Verify    │ ─────────────────────────── │   Backend    │
│    Page     │ ←─── User: unverified ───── │     API      │
└─────────────┘                             └──────────────┘
       │ (après vérification email)
       ▼
┌─────────────┐     GET /auth/status        ┌──────────────┐
│  Dashboard  │ ─────────────────────────── │   Backend    │
│    Page     │ ←─── User: verified ─────── │     API      │
└─────────────┘                             └──────────────┘
```

### 📍 Endpoints d'Authentification

1. **Inscription** (`POST /api/auth/register`)
   - Création du compte utilisateur
   - Envoi d'email de vérification
   - Cookie JWT défini automatiquement
   - Redirection vers page de vérification

2. **Connexion** (`POST /api/auth/login`)
   - Validation des identifiants (email/mot de passe)
   - Génération du token JWT stocké en cookie HTTP-only
   - Récupération des informations utilisateur

3. **Vérification du statut** (`GET /api/auth/status`)
   - Validation automatique du token au chargement
   - Récupération des données utilisateur à jour
   - Gestion des sessions expirées (erreur 403)

4. **Déconnexion** (`POST /api/auth/logout`)
   - Invalidation du token côté serveur
   - Suppression du cookie
   - Nettoyage de l'état local React

### 👤 États Utilisateur

| État | Description | Propriétés Context | Accès autorisé |
|------|-------------|-------------------|----------------|
| **Anonyme** | Non connecté | `isAuthenticated: false` | Routes publiques |
| **Non vérifié** | Connecté, email non confirmé | `isVerified: false` | Vérification + logout |
| **Vérifié** | Compte actif et complet | `isVerified: true` | Toutes fonctionnalités |
| **Banni** | Compte suspendu | `isBanned: true` | Accès restreint |
| **Admin** | Privilèges administrateur | `role: 'ADMIN'` | Accès complet + admin |

### 🛡️ Sécurité

| Mécanisme | Description |
|-----------|-------------|
| **Cookies HTTP-only** | Protection contre les attaques XSS (non accessible via JavaScript) |
| **Credentials: include** | Envoi automatique des cookies avec chaque requête |
| **Validation automatique** | Vérification du token via `checkAuthStatus()` au chargement |
| **Gestion des 403** | Re-vérification du statut et déconnexion si session invalide |
| **Protection CSRF** | Configuration CORS stricte côté backend |

### 📊 Données Utilisateur (AuthContext)

```javascript
const value = {
    userId,           // ID utilisateur
    username,         // Nom d'utilisateur
    email,            // Email
    isBanned,         // Statut de bannissement
    isVerified,       // Statut de vérification email
    role,             // Rôle (USER/ADMIN)
    isAuthenticated,  // Statut de connexion
    loading,          // Chargement en cours
    initialLoading,   // Premier chargement
    login,            // Fonction de connexion
    logout,           // Fonction de déconnexion
    register,         // Fonction d'inscription
    checkAuthStatus,  // Fonction de vérification
};
```

## 🛣️ Gestion des Routes

Le système de routes est organisé par **niveaux de permission** selon le statut et le rôle de l'utilisateur :

### 📂 Configuration des Routes (`config/routes.js`)

```javascript
// Routes publiques (tous)
export const PUBLIC_ROUTES = [
    '/', '/login', '/register', '/privacy-policy', '/terms-of-service'
];

// Routes utilisateur non vérifié
export const UNVERIFIED_USER_ROUTES = ['/verify', '/logout'];

// Routes utilisateur banni
export const BANNED_USER_ROUTES = [...PUBLIC_ROUTES, '/banned', '/logout'];

// Routes utilisateur vérifié
export const VERIFIED_USER_ROUTES = [
    '/dashboard*', '/profile', '/settings', '/search', '/booking/create'
];

// Routes administrateur
export const ADMIN_ROUTES = ['/admin*'];
```

### 🌐 Routes Publiques
Accessibles à tous les utilisateurs (connectés ou non) :

| Route | Page | Description |
|-------|------|-------------|
| `/` | `Home.jsx` | Page d'accueil avec carte interactive |
| `/login` | `Login.jsx` | Connexion utilisateur |
| `/register` | `Register.jsx` | Inscription utilisateur |
| `/privacy-policy` | `PrivacyPolicy.jsx` | Politique de confidentialité |
| `/terms-of-service` | `TermsOfService.jsx` | Conditions générales |

### 🔓 Routes Utilisateur Non Vérifié

| Route | Page | Description |
|-------|------|-------------|
| `/verify` | `Verify.jsx` | Page de vérification d'email |
| `/logout` | `LogoutPage` | Déconnexion |

### ✅ Routes Utilisateur Vérifié

| Route | Page/Layout | Description |
|-------|-------------|-------------|
| `/search` | `Search.jsx` | Recherche de stations |
| `/booking/create` | `BookingCreate.jsx` | Création de réservation |
| `/dashboard` | `DashboardLayout` | Layout tableau de bord |
| `/dashboard/overview` | `Overview.jsx` | Vue d'ensemble |
| `/dashboard/bookings` | `Bookings.jsx` | Gestion des réservations |
| `/dashboard/vehicles` | `Vehicles.jsx` | Gestion des véhicules |
| `/dashboard/stations` | `Stations.jsx` | Gestion des stations |

### 🚫 Routes Utilisateur Banni

| Route | Page | Description |
|-------|------|-------------|
| `/banned` | `BannedPage.jsx` | Information de suspension |

### 🛡️ Composant RouteGuard

Le composant `RouteGuard` effectue automatiquement :

```jsx
// Vérification à chaque navigation
1. Récupération du statut utilisateur depuis AuthContext
2. Vérification des permissions pour la route courante
3. Redirection automatique si nécessaire :
   - Non authentifié + route protégée → /login
   - Non vérifié + route vérifiée → /verify
   - Banni + route protégée → /banned
   - Vérifié + route login/register → /dashboard
```

### 🔧 Fonction utilitaire `isRouteAllowed`

```javascript
export const isRouteAllowed = (currentPath, allowedRoutes) => {
    return allowedRoutes.some(route => {
        // Support des wildcards (ex: '/dashboard*')
        if (route.endsWith('*')) {
            return currentPath.startsWith(route.slice(0, -1));
        }
        return currentPath === route;
    });
};
```

## 🔗 Intégration Backend

Cette application frontend est étroitement intégrée avec l'[**API Electricity Business Backend**](https://github.com/LaiPe/electricity-business-back) pour offrir une expérience utilisateur complète.

### 📡 Client HTTP Centralisé

**Fichier** : `utils/ApiRequest.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const config = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Cookies HTTP-only automatiques
    };

    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Gestion des différents Content-Types
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) return response.json();
    if (contentType?.includes('application/pdf') || 
        contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
        return response.blob();
    
    return null;
};
```

### 🔄 Services API

| Service | Fichier | Endpoints consommés |
|---------|---------|---------------------|
| **BookingService** | `BookingService.js` | `/bookings/*` |
| **StationService** | `StationService.js` | `/stations/*`, `/places/*` |
| **VehicleService** | `VehicleService.js` | `/vehicles/*` |
| **UserService** | `UserService.js` | `/users/*` |
| **GeoService** | `GeoService.js` | APIs externes (Nominatim, Photon) |

### 📊 Récapitulatif des Endpoints

| Domaine | Méthodes HTTP | Endpoints | Opérations |
|---------|---------------|-----------|------------|
| **Auth** | POST, GET | 4 | Register, Login, Logout, Status |
| **Users** | GET | 1 | Profil public |
| **Vehicles** | GET, POST, PUT, DELETE | 7 | CRUD + Modèles |
| **Places** | GET, POST, PUT, DELETE | 4 | CRUD complet |
| **Stations** | GET, POST, PUT, DELETE | 4 | CRUD + Recherche géo |
| **Bookings** | GET, POST, PATCH | 11 | CRUD + Workflow + Export |
| **Total** | - | **31 endpoints** | - |

### 🌐 Compatibilité Environnements

| Environnement | Backend URL | Frontend URL | Réseau Docker |
|---------------|-------------|--------------|---------------|
| **Développement** | `localhost:8080` | `localhost:5173` | - |
| **Production** | `electricity-business.leopeyronnet.fr/api` | Port 3000 | `electricity_business_api_external` |

### 🔧 Prérequis Backend

Pour un fonctionnement optimal, assurez-vous que le backend a :

1. ✅ **CORS configuré** pour votre URL frontend
2. ✅ **Profile approprié** lancé (dev/preprod/prod)
3. ✅ **Bases de données** disponibles (MySQL + MongoDB)
4. ✅ **Variables d'environnement** correctement définies

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
- **ESLint** : Respecter les règles de linting configurées (`npm run lint`)
- **PropTypes** : Valider les props de tous les composants
- **Naming** : Utiliser des noms explicites et cohérents
- **Comments** : Documenter la logique complexe avec JSDoc

#### Structure des Composants

```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Description du composant
 * @param {Object} props - Props du composant
 * @param {string} props.proprieteRequise - Description
 * @param {string} [props.proprieteOptionnelle='default'] - Description
 */
const MonComposant = ({ proprieteRequise, proprieteOptionnelle = "default" }) => {
    // 1. Hooks en premier
    const [state, setState] = useState(null);
    
    // 2. Effects
    useEffect(() => {
        // Side effects
    }, []);

    // 3. Handlers
    const handleClick = () => {
        // ...
    };

    // 4. Render
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

#### Structure des Services API

```javascript
import { apiRequest } from "../utils/ApiRequest";

/**
 * Récupère les données de l'entité
 * @returns {Promise<Object>} Les données
 */
export const getEntity = async () => {
    return await apiRequest('/endpoint', 'GET');
};

/**
 * Crée une nouvelle entité
 * @param {Object} entityData - Données de l'entité
 * @returns {Promise<Object>} L'entité créée
 */
export const createEntity = async (entityData) => {
    return await apiRequest('/endpoint', 'POST', entityData);
};
```

#### Structure des Hooks

```javascript
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour [description]
 * @param {Object} options - Options du hook
 * @returns {Object} État et méthodes
 */
export const useMonHook = (options = {}) => {
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // ...
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { state, loading, error, refetch: fetchData };
};
```

#### Gestion des Erreurs

- **Try/catch** pour toutes les requêtes API
- **useApiCall** pour les appels avec gestion globale
- **Fallback UI** pour les composants critiques
- **Messages utilisateur** explicites en français
- **Console logging** approprié en développement

### 🧪 Tests et Validation

Avant de soumettre une PR :

```bash
# Vérification de la qualité du code
npm run lint

# Build de production (vérifie les erreurs de compilation)
npm run build

# Test de l'application en mode production
npm run preview
```

### 📁 Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| **Composants** | PascalCase | `BookingCalendar.jsx` |
| **Hooks** | camelCase avec préfixe `use` | `useGeolocation.js` |
| **Services** | PascalCase avec suffixe `Service` | `BookingService.js` |
| **Utilitaires** | PascalCase | `MapUtils.js` |
| **Contextes** | PascalCase avec suffixe `Context` | `AuthContext.jsx` |
| **CSS Modules** | camelCase | `Spinner.module.css` |

### 🔗 Intégration avec le Backend

Lors du développement de nouvelles fonctionnalités :

1. **Consulter** la [documentation des endpoints](https://github.com/LaiPe/electricity-business-back/blob/main/ENDPOINTS.md)
2. **Créer** le service correspondant dans `services/`
3. **Tester** avec le backend en mode dev
4. **Valider** l'authentification et les permissions
5. **Vérifier** la gestion d'erreurs API

## 📞 Support & Documentation

### 📚 Documentation Complète

| Ressource | Description | Lien |
|-----------|-------------|------|
| **Backend API** | Documentation complète de l'API | [electricity-business-back](https://github.com/LaiPe/electricity-business-back) |
| **Endpoints** | Détails des endpoints disponibles | [ENDPOINTS.md](https://github.com/LaiPe/electricity-business-back/blob/main/ENDPOINTS.md) |
| **Environnements** | Configuration backend par environnement | [ENVIRONNEMENTS.md](https://github.com/LaiPe/electricity-business-back/blob/main/ENVIRONNEMENTS.md) |

### 📖 Documentation Technique

| Technologie | Documentation officielle |
|-------------|-------------------------|
| **React 19** | [react.dev](https://react.dev/) |
| **Vite** | [vite.dev](https://vite.dev/) |
| **React Router 7** | [reactrouter.com](https://reactrouter.com/) |
| **MapLibre GL** | [maplibre.org](https://maplibre.org/maplibre-gl-js/docs/) |
| **react-map-gl** | [visgl.github.io](https://visgl.github.io/react-map-gl/) |
| **Bootstrap Icons** | [icons.getbootstrap.com](https://icons.getbootstrap.com/) |
| **Nominatim API** | [nominatim.org](https://nominatim.org/release-docs/latest/api/Search/) |
| **Photon API** | [photon.komoot.io](https://photon.komoot.io/) |

### 🆘 Aide et Support

**Pour les problèmes techniques :**

1. **Vérifier les logs** de la console navigateur (`F12` → Console)
2. **Inspecter le réseau** (`F12` → Network) pour les erreurs API
3. **Consulter le statut** de l'API backend (`GET /api/auth/status`)
4. **Valider la configuration** des variables d'environnement
5. **Ouvrir une issue** sur GitHub avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Logs d'erreur (console + network)
   - Environnement (dev/preprod/prod, navigateur)

### 🐛 Debugging

**Outils de débogage disponibles :**

```javascript
// Vérifier l'état d'authentification
console.log('Auth:', useAuth());

// Variables d'environnement
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('ENV:', import.meta.env.VITE_ENV);

// État des contextes
// → React DevTools extension
```

**Problèmes courants :**

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| **CORS Error** | Backend ne permet pas l'origine | Configurer CORS côté backend |
| **401 Unauthorized** | Token manquant/invalide | Vérifier cookies, se reconnecter |
| **403 Forbidden** | Session expirée | Reconnecter l'utilisateur |
| **Network Error** | Backend inaccessible | Vérifier URL et démarrage backend |
| **Carte ne s'affiche pas** | WebGL non supporté | Navigateur compatible WebGL |
| **Géolocalisation refusée** | Permission navigateur | Autoriser dans les paramètres |

### 🔍 Vérification de l'environnement

```bash
# Vérifier les versions
node --version    # ≥ 18.x
npm --version     # ≥ 9.x

# Vérifier les dépendances
npm ls react react-dom react-router-dom maplibre-gl

# Vérifier la configuration Vite
npm run build -- --debug

# Tester le build localement
npm run preview
```

## 📄 Licence

Ce projet est sous **licence MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Projets Liés
- [**Backend API**](https://github.com/LaiPe/electricity-business-back) - API Spring Boot pour la gestion des stations de recharge

### 🙏 Remerciements

| Projet | Contribution |
|--------|--------------|
| **MapLibre GL JS** | Moteur cartographique open-source |
| **OpenStreetMap** | Données cartographiques libres |
| **Photon (Komoot)** | API de géocodage inverse gratuite |
| **Carto** | Tuiles vectorielles Voyager |

---

**Développé avec ❤️ par [LaiPe](https://github.com/LaiPe) pour la révolution de la mobilité électrique**