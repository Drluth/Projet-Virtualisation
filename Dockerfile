# Utilisez l'image de base node:lts-alpine
FROM node:20.10-alpine

# Installez un simple serveur http pour servir un contenu statique
RUN npm install -g http-server

# Définissez le dossier 'app' comme dossier de travail
WORKDIR /app

# Copiez les fichiers et dossiers du projet dans le dossier de travail
COPY . .

# Construisez l'application pour la production en la minifiant
# RUN npm run 
RUN npm install

RUN npm run build

# Exposez le port 8080
EXPOSE 8080

# Commande pour exécuter le serveur http
CMD ["http-server", "dist","-p","5001"]








































