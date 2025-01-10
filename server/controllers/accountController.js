const { registerCompany, validateCompany } = require("../account/accountInsert");
const { verifyCredentials, verifyCredentialsAdmin } = require("../account/accountLogin")
const { getAccountInscriptions, getAccountInfo, getAnnuaireInfo, getAccountInfoByMail, verifyTokenSiren } = require("../account/accountFetcher")
const { deleteInscriptions } = require("../account/accountDelete")
const { updatePassword } = require("../account/accountUpdate")
const { sendConfirmationEmail, sendMailForgotPassword } = require('../nodemailer/mailer');
const jwt = require('jsonwebtoken');


// Fonction pour enregistrer une entreprise
const register = async (req, res) => {
    const { siren, nom, email, password, confirmPassword, adress, zipcode, city, phone } = req.body;
    const result = await registerCompany(siren, nom, email, password, confirmPassword, adress, zipcode, city, phone);
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result);
    }
};

// Fonction pour la connexion utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const result = await verifyCredentials(email, password);

    if (result.success) {
        req.session.user = { siren: result.siren };
        //console.log("Session after login:", req.session.user);
        res.status(201).json(result); 
    } else {
        res.status(500).json(result); 
    }
};

// Fonction pour la connexion administrateur
const loginAdmin = async (req, res) => {
    const { id, password } = req.body;
    const result = await verifyCredentialsAdmin(id, password);

    if (result.success) {
        req.session.admin = { id: result.admin };
        //console.log("Session after login:", req.session.admin);
        res.status(201).json(result); 
    } else {
        res.status(500).json(result); 
    }
};

// Fonction pour récupérer l'état de la session
const getSession = (req, res) => {
    if (req.session.user) {
        //console.log("Session utilisateur active:", req.session.user);
        res.json({ role: "user", session: req.session.user });
    } else if (req.session.admin) {
        //console.log("Session administrateur active:", req.session.admin);
        res.json({ role: "admin", session: req.session.admin });
    } else {
        //console.log("Aucune session active");
        res.status(401).send('Aucune session active');
    }
};

// Fonction pour détruire la session
const destroySession = (req, res) => {
    if (req.session.user || req.session.admin) {
        const sessionType = req.session.user ? "utilisateur" : "administrateur";
        console.log(`Session ${sessionType} active:`, req.session[sessionType]);
        
        req.session.destroy((err) => {
            if (err) {
                console.log('Erreur destruction de session');
                return res.send('Erreur lors de la destruction de la session');
            }
            console.log('Session détruite avec succès');
            res.send('Session détruite avec succès');
        });
    } else {
        console.log("Aucune session active");
        res.status(401).send('Aucune session active');
    }
};

// Fonction pour la réinitialisation du mot de passe
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await getAccountInfoByMail(email);
        if (result.success) {
            const { active, siren, email, token, nom } = result.account[0];
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
};

// Fonction pour vérifier le token
const verifyToken = async (req, res) => {
    const { token, siren } = req.query;
    try {
        const result = await verifyTokenSiren(token, siren);
        if (result.success) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, message: "Token ou SIREN invalide." });
        }
    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
};

// Fonction pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
    const { siren } = req.query;
    const { password, confirmPassword } = req.body;
    try {
        const result = await updatePassword(siren, password, confirmPassword);
        if (result.success) {
            return res.json({ success: true, message: result.message });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
};

//get
const validationAccount = async (req, res) => {
    console.log("Endpoint '/validationAccount' was called");
    try {
        const accountData = await getAccountInscriptions();
        res.json(accountData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /validationAccount :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

//post
const deleteInscription = async (req, res) => {
    console.log("Endpoint '/deleteInscription' was called");
    const { siren } = req.body;
    try {
        const result = await deleteInscriptions(siren);
        if (result.success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /validationAccount :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

//post
const validateInscription = async (req, res) => {
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
};

const annuaire = async (req, res) => {
    console.log("Endpoint '/annuaire' was called");
    const result = await getAnnuaireInfo();
    res.json({result})
}

const verifyJWT = async (req, res) => { 
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé' });
    }
    try {
        const decoded = jwt.verify(token, 'mdp');
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
}


module.exports = {
    register,
    loginUser,
    loginAdmin,
    getSession,
    destroySession,
    forgotPassword,
    verifyToken,
    resetPassword,
    validationAccount,
    deleteInscription, 
    validateInscription,
    annuaire,
    verifyJWT
};

