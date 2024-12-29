#!/bin/bash

# Paramètres de connexion MySQL
USER="root"
PASSWORD="password12345"
HOST="localhost"

# Fichiers SQL
DB_CREATION="BDD_V1.0_Green_Circle.sql"
JDD="JDD_V1.0_Green_Circle.sql"

# Exécution du fichier de création de base de données
echo "Exécution du fichier de création de base de données..."
mysql -u $USER -p$PASSWORD -h $HOST < $DB_CREATION

# Vérifier si la base de données a été créée avec succès
if [ $? -eq 0 ]; then
    echo "Base de données créée avec succès."
else
    echo "Erreur lors de la création de la base de données."
    exit 1
fi

# Exécution du fichier de données
echo "Exécution du fichier de données..."
mysql -u $USER -p$PASSWORD -h $HOST vue_user < $JDD

# Vérifier si les données ont été insérées avec succès
if [ $? -eq 0 ]; then
    echo "Données insérées avec succès."
else
    echo "Erreur lors de l'insertion des données."
    exit 1
fi

echo "Processus terminé."
