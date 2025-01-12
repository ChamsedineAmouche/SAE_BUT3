const {addObjectFavorite} = require('../object/objectInsert')
const {deleteObjectFavorite} = require('../object/objectDelete')

const getSirenFromRequest = (req) => {
    const { siren } = req.query;
    if (siren) return { siren, source: "query" };
    if (req.session && req.session.user) return { siren: req.session.user.siren, source: "session" };
    throw new Error("No siren provided in query or session.");
};

const addListingFavorite = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);
        
        if (source === "session") {
            const { idItem } = req.query;
            await addObjectFavorite(idItem, siren)
        } else {
            res.status(403).json({ error: "Pas de session active." });
        }
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};

const deleteListingFavorite = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);
        
        if (source === "session") {
            const { idItem } = req.query;
            await deleteObjectFavorite(idItem, siren)
        } else {
            res.status(403).json({ error: "Pas de session active." });
        }
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};
module.exports = { addListingFavorite, deleteListingFavorite, getSirenFromRequest };