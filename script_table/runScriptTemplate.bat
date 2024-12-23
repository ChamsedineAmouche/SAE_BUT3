@echo off
REM Paramètres de connexion MySQL
SET USER=root
SET PASSWORD=password
SET HOST=localhost

REM Fichiers SQL
SET DB_CREATION=BDD_V1.0_Green_Circle.sql
SET JDD=JDD_V1.0_Green_Circle.sql

REM Exécution du fichier de création de base de données
echo Exécution du fichier de création de base de données...
mysql -u %USER% -p%PASSWORD% -h %HOST% < %DB_CREATION%

REM Vérifier si la base de données a été créée avec succès
IF %ERRORLEVEL% EQU 0 (
    echo Base de données créée avec succès.
) ELSE (
    echo Erreur lors de la création de la base de données.
    exit /b 1
)

REM Exécution du fichier de données
echo Exécution du fichier de données...
mysql -u %USER% -p%PASSWORD% -h %HOST% vue_user < %JDD%

REM Vérifier si les données ont été insérées avec succès
IF %ERRORLEVEL% EQU 0 (
    echo Données insérées avec succès.
) ELSE (
    echo Erreur lors de l'insertion des données.
    exit /b 1
)

echo Processus terminé.
