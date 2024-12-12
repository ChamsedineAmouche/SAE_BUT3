# Lancer le projet en local

# 1) Prérequis
node —version vérifier si NodeJs est installé

cd client
npm install

cd ..

cd server
npm install

Héberger un serveur MySQL en local.
Créer un ficichier db_connection.js dans server/db_utils a partir du template disponible dans server/db_utils
Renseigner les informations pour se connecter à ta base mysql dans le fichier.

Dans la base mysql éxecuter le script de création des BDD présent dans le repo ainsi que le JDD

# 2) Démarrer l'application en local

## Backend

Ouvrir un terminal
cd server
node server.js

## Frontend
Ouvrir un terminal
cd server
npm start

# 3) Faire attention
S'assurer que les ports 3000 et 5001 sont disponible sur son PC