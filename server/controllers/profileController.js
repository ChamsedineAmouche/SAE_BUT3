const { getAccountInfo, getAccountFavorites } = require("../account/accountFetcher")
const { getListingBySirenAndStatus } = require("../pageProduct/pageProductFetcher")


const profile = async (req, res) => {
    try {
        const { siren } = req.session.user;
        if (req.session.user) {
            profileData = await getAccountInfo(siren);
            const {nom, email, adress, password, zipcode, phone} = profileData.account[0];
            return res.json({ siren, nom, email, adress, password, zipcode, phone });
        }
        else {
            res.json("");
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const profileFavorite = async (req, res) => {
    try {
        const { siren } = req.session.user;
        if (req.session.user) {
            profileData = await getAccountFavorites(siren);
            return res.json(profileData);
        }
        else {
            res.json("");
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const profileListing = async (req, res) => {
    try {
        if (req.session && req.session.user) {
            const { siren } = req.session.user;

            const activeListing = await getListingBySirenAndStatus(siren, 'active');
            const draftListing = await getListingBySirenAndStatus(siren, 'draft');
            res.json({
                active : activeListing,
                draft : draftListing
            });
        } else {
            res.status(401).json({ success: false, message: "User not authenticated" });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission:', error);
        res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
};


const profilePurchases = async (req, res) => {
    try {
        if (req.session && req.session.user) {
            const { siren } = req.session.user;

            res.json({ });
        } else {
            res.status(401).json({ success: false, message: "User not authenticated" });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission:', error);
        res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
};

const profileTransactions = async (req, res) => {
    try{
        if (req.session && req.session.user) {
            const { siren } = req.session.user;

            res.json({ });
        } else {
            res.status(401).json({ success: false, message: "User not authenticated" });
        }
    }
    catch (error){
        console.error(error)
    }
}

const profileParameters = async (req, res) => {
    try{
        if (req.session && req.session.user) {
            const { siren } = req.session.user;

            res.json({ });
        } else {
            res.status(401).json({ success: false, message: "User not authenticated" });
        }
    }
    catch (error){
        console.error(error)
    }
}



module.exports = { profile, profileFavorite, profileListing, profileTransactions, profilePurchases, profileParameters };