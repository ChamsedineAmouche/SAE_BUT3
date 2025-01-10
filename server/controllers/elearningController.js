const { getElearningCategory, getElearningByCategory, getElearningBySiren, getElearningDetail, getElearningDetailEmployee, getElearningInfo } = require('../elearning/elearningFetcher');
const { addFavorite, deleteFavorite} = require('../elearning/elearningUpdate')
const { insertElearning } = require('../elearning/elearningInsert')
const {sendElearningEmail} = require("../nodemailer/mailer")
const {  getCompanyDataBySiren} = require('../pageproduct/pageProductFetcher')

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

const elearningInsert = async (req, res) => {
    try{
        const {siren, source} = getSirenFromRequest(req)
        if (source === "session") {
            const { courseId } = req.query;
            const result = await insertElearning(courseId, siren)
            const { password , token , idElearning } = result
            console.log(password)
            var link = `http://localhost:3000/acces_elearning?courseId=${courseId}&idElearning=${idElearning}&token=${token}&siren=${siren}`
            const companyData = await getCompanyDataBySiren(siren);
            await sendElearningEmail(companyData[0].email, link, companyData[0].nom, password)
        }
    }
    catch(error){
        console.error("Erreur lors de l'insertion de l'elearning:" ,error)
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
}
  
const elearningInfo = async (req, res) => {
    try{
    const { courseId } = req.query;
    const result = await getElearningInfo(courseId)
    res.json(result)
}
    catch(error){
        console.error("Erreur lors de la récupération des infos du elearning:" ,error)
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
}


module.exports = { elearningList, addElearningFavorite, deleteElearningFavorite, elearningPage, elearningInfo, elearningInsert };
