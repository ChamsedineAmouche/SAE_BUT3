const { getAllAccountsInfos } = require("../account/accountFetcher")
const {getSuscpiciousListing} = require("../object/objectFetcher")
const {deleteObject} = require("../object/objectDelete")
const {deleteElearning} = require("../elearning/elearningDelete")
const {getAllElearning} = require("../elearning/elearningFetcher")
const {insertEventAdmin, deleteEventAdmin} = require("../admin/eventAdmin");
const {insertArticleAdmin, deleteArticleAdmin} = require("../admin/articleAdmin");

const getAdminSession = (req, res) => {
    if ((req.session.admin)){
        console.log("test")
        return 1
    };
    throw new Error("No siren provided in query or session.");
};

const allUsers = async (req, res) => {
    try {
        const admin = getAdminSession(req)
        if (admin){
        const result = await getAllAccountsInfos();
        if (!result.success) {
            return res.status(500).json({ message: result.message });
        }
        res.json({ users: result.users, inscriptions: result.inscriptions });}
        else{
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            res.status(500).json('Pas de session admin en cours');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const allElearning = async (req, res) => {
    try {
        const admin = getAdminSession(req)
        if (admin){
        const result = await getAllElearning();
        if (!result.success) {
            return res.status(500).json("Error" );
        }
        res.json({ users: result.users, inscriptions: result.inscriptions });}
        else{
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            res.status(500).json('Pas de session admin en cours');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const getSusObject = async (req, res) => {
    try{
        const admin = getAdminSession(req)
        if (admin){
        const result = await getSuscpiciousListing();
        res.json(result)
    }
    else{
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Pas de session admin en cours');
    }}
    catch(error){
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Erreur interne du serveur' );
    }
}

const deleteDepot = async (req, res) => {
    try{
        const admin = getAdminSession(req)
        if (admin){
            const {idItem} = req.query
        const result = await deleteObject(idItem);
        res.json(result)
    }
    else{
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Pas de session admin en cours');
    }}
    catch(error){
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Erreur interne du serveur' );
    }
}

const deleteELearning = async (req, res) => {
    try{
        const admin = getAdminSession(req)
        if (admin){
            const {courseId} = req.query
        const result = await deleteElearning(courseId);
        res.json(result)
    }
    else{
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Pas de session admin en cours');
    }}
    catch(error){
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Erreur interne du serveur' );
    }
}

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

module.exports = { allUsers, getSusObject, deleteDepot , deleteELearning,allElearning, insertEvent, insertArticle, deleteArticle, deleteEvent }

