const { getDataForEventPage } = require('../event/eventPageFetcher')
const {insertNewInscriptionForEvent} = require("../db_utils/db_insertion");
const {deleteInscription} = require("../event/eventDelete")

const getEventPageData = async (req, res) => {
    try {
        const { id } = req.query;
        const eventPageData = await getDataForEventPage(id);

        res.json(eventPageData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

const inscriptionEvent = async (req, res) => {
    try {
        const {eventId, siren} = req.query;

        await insertNewInscriptionForEvent(eventId, siren);

        // Si besoin, sauvegarde des fichiers et des données dans une base ou un fichier
        res.status(200).json({ message: 'Soumission reçue avec succès'});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const desinscriptionEvent = async (req, res) => {
    try {
        const {eventId, siren} = req.query;

        await deleteInscription(eventId, siren);

        // Si besoin, sauvegarde des fichiers et des données dans une base ou un fichier
        res.status(200).json({ message: 'Soumission reçue avec succès'});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = { getEventPageData, inscriptionEvent, desinscriptionEvent }