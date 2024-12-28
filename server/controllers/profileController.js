const { getAccountInfo, getAccountFavorites } = require("../account/accountFetcher")
const { getListingBySirenAndStatus } = require("../pageproduct/pageProductFetcher")
const {getElearningBySiren} = require("../elearning/elearningFetcher")
const {getTransactiongBySiren} = require("../transactions/transactionFetcher")
const {getAdressContainerByEmplacement} = require("../stockage/stockageFetcher")
const { getProductData} = require('../pageproduct/pageProductFetcher')


const getSirenFromRequest = (req) => {
    const { siren } = req.query;
    if (siren) return { siren, source: "query" };
    if (req.session && req.session.user) return { siren: req.session.user.siren, source: "session" };
    throw new Error("No siren provided in query or session.");
};

const profile = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);
        const profileData = await getAccountInfo(siren);
        const { nom, email, adress, password, zipcode, phone } = profileData.account[0];
        res.json({ siren, nom, email, adress, password, zipcode, phone });
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const profileFavorite = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        const profileData = await getAccountFavorites(siren);
        res.json(profileData);
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const profileListing = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        const activeListing = await getListingBySirenAndStatus(siren, 'active');
        const draftListing = await getListingBySirenAndStatus(siren, 'draft');
        res.json({
            active: activeListing,
            draft: draftListing,
        });
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const profilePurchases = async (req, res) => {
    try {
        const siren = getSirenFromRequest(req);
        const purchases = await getElearningBySiren(siren);
        res.json({ purchases });
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const profileTransactions = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        const transactions = await getTransactiongBySiren(siren);
        const enrichedTransactions = await Promise.all(
            transactions.map(async (transaction) => {
                const { id_item: idItem, date_transaction: dateTransaction, status } = transaction;

                const productData = await getProductData(idItem);
                const { idEmplacement } = productData;

                const containerInfo = await getAdressContainerByEmplacement(idEmplacement);
                const { adress: address, zipcode } = containerInfo[0];

                return { idItem, dateTransaction, status, address, zipcode };
            })
        );
        res.json({ transactions: enrichedTransactions });
    } catch (error) {
        console.error('Erreur lors du traitement des transactions :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const profileParameters = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        res.json({ siren, message: "Profil des paramètres" });
    } catch (error) {
        console.error('Erreur lors du traitement des paramètres :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

module.exports = { profile, profileFavorite, profileListing, profileTransactions, profilePurchases, profileParameters };