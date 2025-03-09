# Lancer le projet en local

## 1) Prérequis

* **Node.js :** Assurez-vous que Node.js est installé (version v20.11.0 recommandée). Vérifiez la version avec la commande : `node --version`
* **Dépendances client :**
    * Naviguez vers le répertoire client : `cd client`
    * Installez les dépendances : `npm install`
    * Retournez au répertoire racine : `cd ..`
* **Dépendances serveur :**
    * Naviguez vers le répertoire serveur : `cd server`
    * Installez les dépendances : `npm install`
* **Serveur MySQL :**
    * Hébergez un serveur MySQL en local.
    * Créez un fichier `db_connection.js` dans `server/db_utils` à partir du modèle fourni dans ce répertoire.
    * Renseignez les informations de connexion à votre base de données MySQL dans `db_connection.js`.
* **Scripts de création de tables :**
    * Naviguez vers le répertoire des scripts : `cd script_table`
    * **Pour Linux/MacOS :**
        * Créez un fichier `runScriptPerso.sh` à partir du modèle `runScriptTemplate.sh`.
        * Exécutez le script dans un terminal : `sh runScriptPerso.sh`
    * **Pour Windows :**
        * Créez un fichier `runScriptPerso.bat` à partir du modèle `runScriptTemplate.bat`.
        * Exécutez le script en double-cliquant sur le fichier ou via la ligne de commande : `runScriptPerso.bat`

## 2) Démarrer l'application en local

### Backend

1.  Ouvrez un terminal.
2.  Naviguez vers le répertoire du serveur : `cd server`
3.  Démarrez le serveur : `node server.js`

### Frontend

1.  Ouvrez un nouveau terminal.
2.  Naviguez vers le répertoire du client : `cd client`
3.  Démarrez l'application : `npm start`

## 3) Points importants

* Assurez-vous que les ports 3000 (frontend) et 5001 (backend) sont disponibles sur votre machine.
* Si vous avez des problèmes de dépendances, essayez de supprimer les dossiers `node_modules` et de relancer `npm install` dans les répertoires `client` et `server`.