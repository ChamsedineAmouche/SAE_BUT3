const { getCategoriesForObjects, getLocalisationOfStockage, getStatesForObjects, insertNewObject } = require('../announcepage/announcePageFetcher');


//get
const addAnnounce = async (req, res) => {
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
};

//post
const insert = async (req, res) => {
    try {
        const newSubmission = req.body;
        const siren = req.session.user.siren;
        let idItem = "";
        if (siren) {
            idItem = await insertNewObject(newSubmission, siren);
        } else {
            throw new Error("Vous n'etes pas connecté");
        }
        idItem = {
            "idItem" : idItem
        }
        res.status(200).json(idItem);
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};


module.exports = { addAnnounce, insert };