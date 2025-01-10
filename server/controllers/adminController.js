//post
const {insertEventAdmin, deleteEventAdmin} = require("../admin/eventAdmin");
const {insertArticleAdmin, deleteArticleAdmin} = require("../admin/articleAdmin");
const insertEvent = async (req, res) => {
    try {
        const newSubmission = req.body;
        console.log('Nouvelle soumission reçue :');

        await insertEventAdmin(newSubmission, req);

        res.status(200).json({ message: 'Soumission reçue avec succès : ' + newSubmission});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const insertArticle = async (req, res) => {
    try {
        const newSubmission = req.body;
        console.log('Nouvelle soumission reçue :');

        await insertArticleAdmin(newSubmission, req);

        // Si besoin, sauvegarde des fichiers et des données dans une base ou un fichier
        res.status(200).json({ message: 'Soumission reçue avec succès : ' + newSubmission});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.query;
        console.log('Nouvelle soumission reçue :');

        await deleteEventAdmin(eventId, req);

        res.status(200).json({ message: 'supprimer cool'});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const articleId = req.query;
        console.log('Nouvelle soumission reçue :');

        await deleteArticleAdmin(articleId, req);

        res.status(200).json({ message: 'supprimer cool'});
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = { insertEvent, insertArticle, deleteArticle, deleteEvent };