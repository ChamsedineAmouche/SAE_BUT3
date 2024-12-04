const express = require('express')
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');
const cors = require('cors');
const { registerCompany } = require("./account/accountInsert");
const { verifyCredentials } = require("./account/accountLogin")
const app = express()


const { getNumberOfCompany } = require('./homepage/homepageFetcher');
const { getCategoriesForObjects, getLocalisationOfStockage } = require('./announcepage/announcePageFetcher');

app.use(express.json());

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

app.get('/set-session', (req, res) => {
    req.session.user = { siren: '1' };  // FIXME : A modifier avec siren au moment de la connexion
    res.send('Session créée avec succès!');
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


const server = app.listen(5001, () => {
    console.log("Server started on port 5001");
});

module.exports = { app, server };