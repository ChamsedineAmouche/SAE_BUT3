const {getResultOfQuery} = require("../db_utils/db_functions");
const getDbConnection = require("../db_utils/db_connection");

const getAllDiscussionsOfCompany = async (req, res) => {
    console.log("Endpoint '/discussionsCompany' was called");
    try {
        const currentSiren = req.session.user.siren;

        if (!currentSiren) {
            throw new Error("Vous n'êtes pas connecté");
        }

        const result = await getResultOfQuery('vue_user',
            `SELECT 
                c.id, 
                c.firstSiren, 
                c.secondSiren, 
                c.dateCreation, 
                c.idItem,
                c1.nom AS firstCompanyName, 
                c2.nom AS secondCompanyName  
             FROM chat c
             LEFT JOIN company c1 ON c.firstSiren = c1.siren
             LEFT JOIN company c2 ON c.secondSiren = c2.siren
             WHERE c.firstSiren = ${currentSiren} OR c.secondSiren = ${currentSiren}
             ORDER BY c.dateCreation DESC`
        );
        
        res.json({
            "allDiscussionsOfCompany": result
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSpecificDiscussions = async (req, res) => {
    console.log("Endpoint '/specificDiscussion' was called");
    try {
        const currentSiren = req.session.user.siren;
        const { siren, idItem } = req.query;

        if (!currentSiren) {
            throw new Error("Vous n'êtes pas connecté");
        }

        const result = await getResultOfQuery('vue_user',
            `SELECT 
                chat.id, 
                chat.firstSiren, 
                chat.secondSiren, 
                chat.dateCreation, 
                chat.idItem,
                company1.nom AS firstCompanyName,  
                company2.nom AS secondCompanyName  
             FROM chat
             LEFT JOIN company company1 ON chat.firstSiren = company1.siren
             LEFT JOIN company company2 ON chat.secondSiren = company2.siren
             WHERE 
                ((chat.firstSiren = ${currentSiren} AND chat.secondSiren = ${siren}) 
                OR (chat.firstSiren = ${siren} AND chat.secondSiren = ${currentSiren}))
                AND (chat.idItem = ${idItem})
             ORDER BY chat.dateCreation DESC`
        );
        
        res.json({
            "specificDiscussion": result
        });        
    } catch (err) {
        res.status(500).json(err);
    }
};

const getChat = async (req, res) => {
    console.log("Endpoint '/chat' was called");
    try {
        const { id } = req.query;
        const result = await getResultOfQuery('vue_user',
            `SELECT siren, message, dateMessage
             FROM chat_message
             WHERE chatId = ${id}
             ORDER BY dateMessage ASC;`);
        res.json({
            "message" : result
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const insertCompanyDiscussion = async (req, res) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        const currentSiren = req.session.user.siren;
        const { siren, idItem } = req.query;

        if (!currentSiren) {
            throw new Error("Vous n'êtes pas connecté");
        }

        const datePosted = new Date().toISOString().slice(0, 10);

        await promiseConnection.beginTransaction();

        const [discussionResult] = await promiseConnection.execute(
            `INSERT INTO chat (firstSiren, secondSiren, dateCreation, idItem)
             VALUES (?, ?, ?, ?)`, [currentSiren, siren, datePosted, idItem]);

        await promiseConnection.commit();

        res.status(200).json({
            message: "Discussion créée avec succès",
        });
    } catch (error) {
        await promiseConnection.rollback();
        console.error("Erreur lors de l'insertion de la discussion :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    } finally {
        await promiseConnection.end();
    }
};

const insertChat = async (req, res) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        const { message } = req.body;
        const { discussionId } = req.query;
        const siren = req.session.user.siren;

        if (!siren) {
            throw new Error("Vous n'êtes pas connecté");
        }

        const datePosted = new Date().toISOString().slice(0, 10);

        await promiseConnection.beginTransaction();

        const [result] = await promiseConnection.execute(
            `INSERT INTO chat_message (chatId, siren, message, dateMessage)
             VALUES (?, ?, ?, ?)`, [discussionId, siren, message, datePosted]);

        await promiseConnection.commit();

        res.status(200).json({ message: "Message ajouté avec succès", messageId: result.insertId });
    } catch (error) {
        await promiseConnection.rollback();
        console.error("Erreur lors de l'insertion du message :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    } finally {
        await promiseConnection.end();
    }
};

module.exports = {getAllDiscussionsOfCompany, getSpecificDiscussions, getChat, insertCompanyDiscussion, insertChat}