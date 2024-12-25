const express = require('express')
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');
const cors = require('cors');
const app = express()
const RateLimit = require('express-rate-limit');

const { getDataForCatalogPage } = require('./catalog/catalogFetcher')
const { getCategoriesForObjects, getLocalisationOfStockage, getStatesForObjects, insertNewObject } = require('./announcepage/announcePageFetcher');
const { getImageById } = require('./image/imageFetcher')
const { getDataForProductPageById } = require('./pageproduct/pageProductFetcher')

const homepageRoutes = require('./routes/homepageRoutes'); 
const accountRoutes = require('./routes/accountRoutes');

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
});
app.use('/verifyToken', limiter);
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

app.use(accountRoutes);
app.use(homepageRoutes);
//---------------------------------------------------------------------------------------------------------
//Endpoint ajouter annonce
//---------------------------------------------------------------------------------------------------------
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

//---------------------------------------------------------------------------------------------------------
//ENDPOINT LISTE OBJET
//---------------------------------------------------------------------------------------------------------
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


//---------------------------------------------------------------------------------------------------------
//ROUTE IMAGE
//---------------------------------------------------------------------------------------------------------
app.get("/image", async (req, res) => {
    const { id } = req.query; // Récupère l'ID depuis les paramètres de requête
    try {
        if (!id) {
            return res.status(400).json({ error: "ID non fourni" });
        }

        const rows = await getImageById(id); // Récupère l'image selon l'ID
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Image non trouvée" });
        }

        const images = rows.map((row) => ({
            data: Array.from(new Uint8Array(row.image)),
            mimeType: row.mime_type,
        }));

        res.json(images);
    } catch (error) {
        console.error("Erreur lors de la récupération des données pour /image :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des données." });
    }
});


//---------------------------------------------------------------------------------------------------------
//ROUTE INSERT
//---------------------------------------------------------------------------------------------------------
app.post("/insert", async (req, res) => {
    try {
        const newSubmission = req.body;
        console.log('Nouvelle soumission reçue :');
        console.log('regarde :', newSubmission);

        await insertNewObject(newSubmission);

        // Si besoin, sauvegarde des fichiers et des données dans une base ou un fichier
        res.status(200).json({ message: 'Soumission reçue avec succès : ' + newSubmission});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});



//---------------------------------------------------------------------------------------------------------
//ROUTE PAGE PRODUIT
//---------------------------------------------------------------------------------------------------------
app.get("/product", async (req, res) => {
    try {
        const { id } = req.query;
        let pageProductData;
        if (req.session.user) {
            pageProductData = await getDataForProductPageById(id, req.session.user);
        }
        else {
            pageProductData = await getDataForProductPageById(id, "");
        }
        res.json(pageProductData);
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

const server = app.listen(5001, () => {
    console.log("Server started on port 5001");

module.exports = { app, server };