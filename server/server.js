const express = require('express')
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');
const cors = require('cors');
const { registerCompany } = require("./account/accountInsert");
const { verifyCredentials } = require("./account/accountLogin")
const app = express()

const { getDataForHomePage } = require('./homepage/homepageFetcher');
const { getDataForCatalogPage } = require('./catalog/catalogFetcher')
const { getCategoriesForObjects, getLocalisationOfStockage, getStatesForObjects, insertNewObject } = require('./announcepage/announcePageFetcher');
<<<<<<< HEAD
const { getImage } = require('./image/imageFetcher')
=======
>>>>>>> b9eea10 (insertion correcte)

app.use(express.json({ limit: '50mb' }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true                 
}));
//---------------------------------------------------------------------------------------------------------
//Partie session création de compte
//---------------------------------------------------------------------------------------------------------
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),  // Clé secrète pour signer l'ID de session, 
    resave: false,                // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: true,      // Sauvegarder une session si elle est nouvelle mais n'a pas été modifiée
    cookie: { secure: false }
}));

app.post("/register", async (req, res) => {
    const { siren, nom , email, password, adress, zipcode, city, phone } = req.body;
    const result = await registerCompany(siren, nom , email, password, adress, zipcode, city, phone);
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await verifyCredentials(email, password);

    if (result.success) {
        req.session.user = { siren: result.siren };
        console.log("Session after login:", req.session.user);
        res.status(201).json(result); 
    } else {
        res.status(500).json(result); 
    }
});

app.post("/insert", async (req, res) => {
    try {
        const newSubmission = req.body;
<<<<<<< HEAD
        console.log('Nouvelle soumission reçue :');
        console.log('regarde :', newSubmission);

        await insertNewObject(newSubmission);

=======

        await insertNewObject(newSubmission);

        console.log('Nouvelle soumission reçue :');
        console.log('regarde :', newSubmission);

>>>>>>> b9eea10 (insertion correcte)
        // Si besoin, sauvegarde des fichiers et des données dans une base ou un fichier
        res.status(200).json({ message: 'Soumission reçue avec succès : ' + newSubmission});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.get('/get-session', (req, res) => {
    if (req.session.user) {
        console.log("Session active:", req.session.user);
        res.json(req.session.user);
    } else {
        console.log("Aucune session active");
        res.send('Aucune session active');
    }
});

app.get('/destroy-session', (req, res) => {
    if (req.session.user) {
        console.log("Session active:", req.session.user);
        
    req.session.destroy((err) => {
        if (err) {
            console.log('Erreur destruction de session');
            return res.send('Erreur lors de la destruction de la session');
        }
        console.log('Session détruite avec succès');
        res.send('Session détruite avec succès');
    });}
    else{
        console.log("Aucune session active")
    }
});

//ROUTE HOMEPAGE
app.get("/homepage", async (req, res) => {
    console.log("Endpoint '/' was called");
    try {
        const homepagedata = await getDataForHomePage();
        console.log(homepagedata);
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
        const statesForObjects = await getStatesForObjects();
        addannouncedata = {
            "categoriesForObjects" : categoriesForObjects,
            "containerAvailable" : containerAvailable,
            "statesForObjects" : statesForObjects
        }
        res.json(addannouncedata);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});

//ENDPOINT PAGE LISTE OBJET
app.get("/catalog", async (req, res) => {
    console.log("Endpoint '/catalog' was called");
    try {
        const catalogData = await getDataForCatalogPage();
        res.json(catalogData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});


//ENDPOINT IMAGES
app.get("/image", async (req, res) => {
    console.log("Endpoint '/image' was called");
    try {
        const rows = await getImage();
        console.log(rows);
        const images = rows.map(row => ({
            data: Array.from(new Uint8Array(row.image)), // Conversion en tableau de bytes
            mimeType: row.mime_type, // Remplace par le vrai type MIME si nécessaire
        }));
        console.log(images);
        res.json(images);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
})

const server = app.listen(5001, () => {
    console.log("Server started on port 5001");
});

module.exports = { app, server };