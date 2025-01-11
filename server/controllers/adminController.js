const { getAllAccountsInfos } = require("../account/accountFetcher")
const {getSuscpiciousListing} = require("../object/objectFetcher")
const {deleteObject} = require("../object/objectDelete")
const {deleteElearning} = require("../elearning/elearningDelete")
const {getAllElearning} = require("../elearning/elearningFetcher")


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

module.exports = { allUsers, getSusObject, deleteDepot , deleteELearning,allElearning }