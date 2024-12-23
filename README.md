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

cd script_table
# Pour Linux/MacOS
Créer un fichier 'runScriptPerso.sh' a partir de la template runScriptTemplate.sh
sh runScriptPerso.sh

# Pour Windows
Créer un fichier 'runScriptPerso.bat' a partir de la template runScriptTemplate.bat
double clique sur le fichier runScriptPerso.bat ou ecrire en ligne de commande 'runScriptPerso.bat'
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