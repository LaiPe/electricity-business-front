# Étape de build
FROM node:18-alpine AS build

WORKDIR /app

# Argument de build pour l'URL de l'API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copier package.json
COPY package.json ./

# Installer toutes les dépendances
RUN npm install

# Copier le code source
COPY . .

# Builder l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]