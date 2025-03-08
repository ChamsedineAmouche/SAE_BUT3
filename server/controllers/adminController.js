const {getAllAccountsInfos, getAccountInfo} = require("../account/accountFetcher")
const {getSuscpiciousListing} = require("../object/objectFetcher")
const {deleteObject} = require("../object/objectDelete")
const {deleteElearning} = require("../elearning/elearningDelete")
const {getAllElearning, getElearningCategory} = require("../elearning/elearningFetcher")
const {getAllEvents, insertEventAdmin, deleteEventAdmin} = require("../admin/eventAdmin")
const {getAllArticles, insertArticleAdmin, deleteArticleAdmin} = require("../admin/articleAdmin")
const {insertElearningAdmin} = require("../admin/elearningAdmin")
const getDbConnection = require("../db_utils/db_connection");
const { validateObject } = require("../object/objectValidation");

const getAdminSession = (req, res) => {
    if ((req.session.admin)){
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
            res.json({ result })
        } else {
            console.error("Erreur lors de la récupération des ELearnings :", error);
            res.status(500).json('Pas de session admin en cours');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des ELearnings :", error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const getSusObject = async (req, res) => {
    try {
        const admin = getAdminSession(req)
        if (admin){
            const result = await getSuscpiciousListing();
            const deposits = result.result;

            const enrichedDeposits = await Promise.all(
                deposits.map(async (deposit) => {
                    const companyInfo = await getAccountInfo(deposit.siren);
                    const companyName = companyInfo.success && companyInfo.account.length > 0
                        ? companyInfo.account[0].nom 
                        : 'Non spécifié';

                    return { ...deposit, company_name: companyName };
                })
            );

            res.json({ deposits: enrichedDeposits });
        } else {
            console.error("Erreur lors de la récupération des depots :", error);
            res.status(500).json('Pas de session admin en cours');
        }
    } catch(error){
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

        const result = await insertEventAdmin(newSubmission, req);

        if (result.success) {
            res.status(200).json({ success: true, message: 'Soumission reçue avec succès.'});
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const insertArticle = async (req, res) => {
    try {
        const newSubmission = req.body;
        console.log('Nouvelle soumission reçue :');

        const result = await insertArticleAdmin(newSubmission, req);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const {eventId} = req.query;
        console.log('Nouvelle soumission reçue :');
        const result = await deleteEventAdmin(eventId, req);
        res.json(result);
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const {articleId} = req.query;
        console.log('Nouvelle soumission reçue :');
        const result = await deleteArticleAdmin(articleId, req);
        res.json(result)
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const allEvents = async (req, res) => {
    try {
        const admin = getAdminSession(req)
        if (admin){
        const result = await getAllEvents();
            if (!result.success) {
                return res.status(500).json("Error" );
            }
            res.json({ result })
        } else {
            console.error("Erreur lors de la récupération des evenements :", error);
            res.status(500).json('Pas de session admin en cours');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des evenements :", error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const allArticles = async (req, res) => {
    try {
        const admin = getAdminSession(req)
        if (admin){
        const result = await getAllArticles();
            if (!result.success) {
                return res.status(500).json("Error" );
            }
            res.json({ result })
        } else {
            console.error("Erreur lors de la récupération des articles :", error);
            res.status(500).json('Pas de session admin en cours');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

const elearningCategories = async (req, res) => {
    try {
        const category = await getElearningCategory();
        
        res.json({ category });
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

const insertElearning = async (req, res) => {
    try {
        const newSubmission = req.body;
        console.log('Nouvelle soumission reçue :');

        const result = await insertElearningAdmin(newSubmission, req);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(500).json({ success: false, message: result.message });
        } 
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
}

const validateDepot = async (req, res) => {
    try {
        console.log("📩 Requête reçue sur /validateDepot avec idItem :", req.query.idItem);

        const admin = getAdminSession(req);
        if (!admin) {
            return res.status(403).json({ error: "Pas de session admin en cours" });
        }

        const { idItem } = req.query;

        if (!idItem) {
            return res.status(400).json({ error: "ID de l'objet requis" });
        }

        const result = await validateObject(idItem);

        if (!result) {
            console.error("❌ Erreur lors de la validation SQL");
            return res.status(500).json({ error: "Erreur lors de la validation de l'objet" });
        }
        
        console.log("✅ Objet validé avec succès !");
        res.status(200).json({ success: true, message: "Objet validé avec succès" });

    } catch (error) {
        console.error("Erreur lors de la validation de l'objet :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

const deleteMessage = async (req, res) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    
    try {
        const { messageId } = req.query;

        const admin = getAdminSession(req);
        if (!admin) {
            return res.status(403).json({ error: "Pas de session admin en cours" });
        }

        if (!messageId) {
            return res.status(400).json({ error: "ID du message requis" });
        }

        await promiseConnection.beginTransaction();

        // Suppression du message
        const [result] = await promiseConnection.execute(
            `DELETE FROM message WHERE id = ?`,
            [messageId]
        );

        await promiseConnection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Message non trouvé ou déjà supprimé" });
        }

        res.status(200).json({ success: true, message: "Message supprimé avec succès" });

    } catch (error) {
        await promiseConnection.rollback();
        console.error("❌ Erreur lors de la suppression du message :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    } finally {
        await promiseConnection.end();
    }
};

module.exports = { allUsers, getSusObject, deleteDepot , deleteELearning,allElearning, insertEvent, insertArticle, deleteArticle, deleteEvent, allEvents, allArticles, elearningCategories, insertElearning, validateDepot, deleteMessage }

