const {getResultOfQuery} = require('../db_utils/db_functions');

const getSirenFromRequest = (req) => {
    const { siren } = req.query;
    if (siren) return { siren, source: "query" };
    if (req.session && req.session.user) return { siren: req.session.user.siren, source: "session" };
    throw new Error("No siren provided in query or session.");
};


const getNotifs = async (req, res) => {
    try {
        const { siren } = getSirenFromRequest(req);
        const query = `SELECT id, message, is_read FROM notif WHERE siren = ${siren}`;
        console.log(query);
        
        const result = await getResultOfQuery("vue_user", query);

        const notRead = result.filter(notif => notif.is_read === 0);
        const read = result.filter(notif => notif.is_read === 1);

        res.json({ notRead, read });

    } catch (error) {
        console.error("Erreur lors du traitement de la soumission :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};


const updateNotif = async (req, res) => {
    try {
        const { id } = req.body; 
        if (!id) {
            return res.status(400).json({ error: "ID manquant" });
        }
        const query = `UPDATE notif SET is_read = 1 WHERE id = ${id}`;
        const result = await getResultOfQuery("vue_user", query);

        return res.status(200).json({ success: true, message: "Notification mise à jour", result });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la notification:", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};



module.exports = { getNotifs, updateNotif };