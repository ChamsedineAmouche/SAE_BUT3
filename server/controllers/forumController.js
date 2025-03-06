const {getResultOfQuery} = require("../db_utils/db_functions");
const getDbConnection = require("../db_utils/db_connection");

const getAllDiscussions = async (req, res) => {
    console.log("Endpoint '/forum' was called");
    try {
        const result = await getResultOfQuery('vue_user',
            `SELECT
                 d.id,
                 d.title,
                 d.date_creation,
                 c.nom AS company_name
             FROM discussion d
             JOIN company c ON d.siren = c.siren
             ORDER BY d.date_creation DESC`);
        res.json({
            "allDiscussions" : result
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getDiscussion = async (req, res) => {
    console.log("Endpoint '/discussion' was called");
    try {
        const { id } = req.query;
        const global = await getResultOfQuery('vue_user',
            `SELECT
                 d.id AS discussion_id,
                 d.title AS discussion_title,
                 d.date_creation AS discussion_date
            FROM discussion d
            WHERE d.id = ${id}`
            )
        const result = await getResultOfQuery('vue_user',
            `SELECT
                 m.id AS id,
                 c.nom AS company_name,
                 m.date_of_message AS message_date,
                 m.message AS message_content,
                 m.status AS status
             FROM message m
             JOIN discussion d ON m.discussion_id = d.id
             JOIN company c ON m.siren = c.siren
             WHERE d.id = ${id}
             ORDER BY m.date_of_message ASC`);
        res.json({
            "discussionInfos" : global,
            "message" : result
        });
    } catch (err) {
        res.status(500).json(err);
    }
};
 
const insertDiscussion = async (req, res) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        const { title, message } = req.body;
        const siren = req.session.user.siren;

        if (!siren) {
            throw new Error("Vous n'êtes pas connecté");
        }

        const datePosted = new Date().toISOString().slice(0, 10);

        await promiseConnection.beginTransaction();

        const [discussionResult] = await promiseConnection.execute(
            `INSERT INTO discussion (title, siren, date_creation) 
             VALUES (?, ?, ?)`, [title, siren, datePosted]);

        const discussionId = discussionResult.insertId;
        const messageStatus = "OK";

        await promiseConnection.execute(`INSERT INTO message (discussion_id, siren, message, date_of_message, status) 
             VALUES (?, ?, ?, ?, ?)`, [discussionId, siren, message, datePosted, messageStatus]);

        await promiseConnection.commit();

        res.status(200).json({
            message: "Discussion créée avec succès",
            discussionId: discussionId
        });
    } catch (error) {
        await promiseConnection.rollback();
        console.error("Erreur lors de l'insertion de la discussion :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    } finally {
        await promiseConnection.end();
    }
};

const insertMessage = async (req, res) => {
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
        const messageStatus = "OK";

        await promiseConnection.beginTransaction();

        const [result] = await promiseConnection.execute(
            `INSERT INTO message (discussion_id, siren, message, date_of_message, status) 
             VALUES (?, ?, ?, ?, ?)`, [discussionId, siren, message, datePosted, messageStatus]);

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

const reportMessage = async (req, res) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        const { messageId } = req.query;

        const messageStatus = "REPORTED";

        await promiseConnection.beginTransaction();

        const [result] = await promiseConnection.execute(
            `UPDATE message SET status = ? WHERE id = ?`,
            [messageStatus, messageId]
        );

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

const getReportedMessage = async (req, res) => {
    try {
        const result = await getResultOfQuery('vue_user',
            `SELECT * FROM message WHERE status = 'REPORTED'`);
        res.json({
            "messages" : result
        });
    } catch (error) {
        console.error("Erreur lors de la recuperation des messages :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

const validateMessage = async (req, res) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        const { messageId, messageStatus } = req.query;

        await promiseConnection.beginTransaction();

        const [result] = await promiseConnection.execute(
            `UPDATE message SET status = ? WHERE id = ?`,
            [messageStatus, messageId]);

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

module.exports = { getAllDiscussions, getDiscussion, insertDiscussion, insertMessage, reportMessage, validateMessage, getReportedMessage };