const express = require('express')
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express()

const { getNumberOfCompany } = require('./homepage/homepageFetcher');
const { getCategoriesForObjects, getLocalisationOfStockage } = require('./announcepage/announcePageFetcher');
const { insertIntoDatabase } = require('db_utils/db_functions');

app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),  // Clé secrète pour signer l'ID de session, 
    resave: false,                // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: true,      // Sauvegarder une session si elle est nouvelle mais n'a pas été modifiée
    cookie: { secure: true }
}));

app.get('/set-session', (req, res) => {
    req.session.user = { siren: '1' };  // FIXME : A modifier avec siren au moment de la connexion
    res.send('Session créée avec succès!');
});


app.get('/get-session', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.send('Aucune session active');
    }
});

app.get('/destroy-session', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Erreur lors de la destruction de la session');
        }
        res.send('Session détruite avec succès');
    });
});

//ROUTE HOMEPAGE
app.get("/", async (req, res) => {
    console.log("Endpoint '/' was called");
    try {
        const companyNb = await getNumberOfCompany(); 

        homepagedata = {
            "numberOfCompany" : companyNb
        }
        res.json(homepagedata); 
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});

//ENDPOINT PAGE AJOUTER UNE ANNONCES
app.get("/addAnnounce", async (req, res) => {
    console.log("Endpoint '/addAnnounce' was called");
    try {
        const categoriesForObjects = await getCategoriesForObjects();
        const containerAvailable = await getLocalisationOfStockage();
        addannouncedata = {
            "categoriesForObjects" : categoriesForObjects,
            "containerAvailable" : containerAvailable
        }
        res.json(addannouncedata);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});

app.get("/insertObject", async (req, res) => {
    try {
        //const formData = req.body; Quand le front sera fait normalement on recup le json comme ca
        let formData = "";
        try {
            const filePath = "/server/fichiertest/test.json";
            const fileContent = fs.readFileSync(filePath, 'utf8');
            formData = JSON.parse(fileContent);
            console.log('Données chargées :', formData);
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier JSON :', error);
        }

        console.log('Formulaire reçu:', formData);

        if (!formData.title
            || !formData.hauteur
            || !formData.largeur
            || !formData.longueur
            || !formData.description
            || !formData.category
            || !formData.localisation) {
            return res.status(400).json({ error: 'Tout les champs sont requis.' });
        }

        const query = `
            INSERT INTO announces (title, hauteur, largeur, longueur, description, category, localisation)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const valuesForObjectTable = processFormForInsertion(formData);

        insertIntoDatabase('vue_user', query, values);
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});


app.listen(5001, () =>{console.log("Server started on port 5001")})