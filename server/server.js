const express = require('express')
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');
const cors = require('cors');
const app = express()
const RateLimit = require('express-rate-limit');

const { registerCompany, validateCompany } = require("./account/accountInsert");
const { verifyCredentials, verifyCredentialsAdmin } = require("./account/accountLogin")
const { getAccountInscriptions, getAccountInfo, getAnnuaireInfo, getAccountInfoByMail, verifyToken } = require("./account/accountFetcher")
const { deleteInscription } = require("./account/accountDelete")
const { updatePassword } = require("./account/accountUpdate")

const { getDataForHomePage } = require('./homepage/homepageFetcher');
const { getDataForCatalogPage } = require('./catalog/catalogFetcher')
const { getCategoriesForObjects, getLocalisationOfStockage, getStatesForObjects, insertNewObject } = require('./announcepage/announcePageFetcher');
const { getImageById } = require('./image/imageFetcher')

const { sendConfirmationEmail, sendMailForgotPassword } = require('./nodemailer/mailer');
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

app.post("/register", async (req, res) => {
    const { siren, nom , email, password, confirmPassword, adress, zipcode, city, phone } = req.body;
    const result = await registerCompany(siren, nom , email, password, confirmPassword, adress, zipcode, city, phone);
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

app.post("/loginAdmin", async (req, res) => {
    const { id, password } = req.body;
    const result = await verifyCredentialsAdmin(id, password);

    if (result.success) {
        req.session.admin = { id: result.admin };
        console.log("Session after login:", req.session.admin);
        res.status(201).json(result); 
    } else {
        res.status(500).json(result); 
    }});

app.get('/getSession', (req, res) => {
    if (req.session.user) {
        console.log("Session utilisateur active:", req.session.user);
        res.json({ role: "user", session: req.session.user });
    } 
    else if (req.session.admin) {
        console.log("Session administrateur active:", req.session.admin);
        res.json({ role: "admin", session: req.session.admin });
    }
    else {
        console.log("Aucune session active");
        res.status(401).send('Aucune session active');
    }
});

app.get('/destroySession', (req, res) => {
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
    else if (req.session.admin){
        console.log("Session active:", req.session.admin);
        
        req.session.destroy((err) => {
            if (err) {
                console.log('Erreur destruction de session');
                return res.send('Erreur lors de la destruction de la session');
            }
            console.log('Session détruite avec succès');
            res.send('Session détruite avec succès');
        });
    }
    else{
        console.log("Aucune session active")
    }
});

app.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;
    try {
        const result = await getAccountInfoByMail(email);
        if (result.success) {
            console.log(result);
            const { active, siren, email, token, nom } = result.account[0];
            console.log(siren, email, token, nom);
            if (active) {
                await sendMailForgotPassword(siren, email, token, nom);
                return res.json({ success: true, message: "Un email de réinitialisation de mot de passe a été envoyé." });
            } else {
                return res.status(400).json({ success: false, message: "Le compte associé n'est pas actif." });
            }
        } else {
            return res.status(404).json({ success: false, message: "Aucun compte trouvé avec cet email." });
        }
    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ success: false, message: "Une erreur est survenue. Veuillez réessayer plus tard." });
    }
});

app.get("/verifyToken", async (req, res) => {
    const { token, siren } = req.query; 
    console.log(token, siren)
    try {
        const result = await verifyToken(token, siren); 
        console.log(result)
        if (result.success) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, message: "Token ou SIREN invalide." });
        }
    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
});

app.post("/resetPassword", async (req, res) => {
    const {siren } = req.query; 
    const { password, confirmPassword } = req.body;
    try {
        const result = await updatePassword(siren, password, confirmPassword); 
        if (result.success) {
            return res.json({ success: true, message : result.message });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
});

//---------------------------------------------------------------------------------------------------------
//ROUTE HOMEPAGE
//---------------------------------------------------------------------------------------------------------
app.get("/homepage", async (req, res) => {
    console.log("Endpoint '/' was called");
    try {
        const homepagedata = await getDataForHomePage();
        //console.log(homepagedata);
        res.json(homepagedata); 
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});

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
//ROUTE VALIDATION COMPTE ADMIN
//---------------------------------------------------------------------------------------------------------
app.get("/validationAccount", async (req, res) => {
    console.log("Endpoint '/validationAccount' was called");
    try {
        const accountData = await getAccountInscriptions();
        res.json(accountData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /validationAccount :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});
app.post("/deleteInscription", async (req, res) => {
    console.log("Endpoint '/deleteInscription' was called");
    const { siren } = req.body;
    try {
        const result = await deleteInscription(siren);
        if (result.success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /validationAccount :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
});

app.post("/validateInscription", async (req, res) => {
    console.log("Endpoint '/validateInscription' was called");
    const { siren } = req.body;
    try {
        const result = await validateCompany(siren);
        if (result.success) {
            const companyData = await getAccountInfo(siren)
            console.log(companyData)
            const { email, nom } = companyData.account[0]; 
            await sendConfirmationEmail(email, siren, nom);
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /validationAccount :', error);
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
//ROUTE ANNUAIRE
//---------------------------------------------------------------------------------------------------------
app.get("/annuaire", async (req, res) => {
    console.log("Endpoint '/annuaire' was called");
    const result = await getAnnuaireInfo();
    res.json({result})
})
const server = app.listen(5001, () => {
    console.log("Server started on port 5001");
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

module.exports = { app, server };