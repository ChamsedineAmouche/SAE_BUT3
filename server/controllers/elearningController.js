const { getElearningCategory, getElearningByCategory, getElearningBySiren, getElearningDetail, getElearningDetailEmployee } = require('../elearning/elearningFetcher');
const { addFavorite, deleteFavorite} = require('../elearning/elearningUpdate')

const getSirenFromRequest = (req) => {
    const { siren } = req.query;
    if (siren) return { siren, source: "query" };
    if (req.session && req.session.user) return { siren: req.session.user.siren, source: "session" };
    throw new Error("No siren provided in query or session.");
};

const elearningList = async (req, res) => {
    try {
        const category = await getElearningCategory();
        const elearningByCat = await getElearningByCategory();        
        let elearningCompany = {}; // Valeur par défaut
        if (req.session && req.session.user) {
            elearningCompany = await getElearningBySiren(req.session.user.siren);
        }

        const eLearningData = {
            categories: category,
            eLearnings: elearningByCat,
            myElearnings: elearningCompany
        };
        
        res.json(eLearningData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

const addElearningFavorite = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);
        
        if (source === "session") {
            const { elearningid } = req.query;
            await addFavorite(siren, elearningid) 
        } else {
            res.status(403).json({ error: "Pas de session active." });
        }
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};

const deleteElearningFavorite = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);
        
        if (source === "session") {
            const { elearningid } = req.query;
            await deleteFavorite(siren, elearningid) 
        } else {
            res.status(403).json({ error: "Pas de session active." });
        }
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};

const elearningPage = async (req, res) => {
    try{
        const {siren, source} = getSirenFromRequest(req)
        if (source === "session") {
            const { idElearning } = req.query;
            const result = await getElearningDetail(idElearning, siren)
            res.json(result)
        }
        if (source === "query"){
            const { idElearning, password, token } = req.query;
            const result = await getElearningDetailEmployee(idElearning, password, token, siren)
            res.json(result)        
        }
    }
    catch(error){
        console.error("Erreur lors de la récupération des infos du elearning:" ,error)
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
}

module.exports = { elearningList, addElearningFavorite, deleteElearningFavorite, elearningPage };
