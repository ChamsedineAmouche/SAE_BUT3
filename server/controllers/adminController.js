const { getAllAccountsInfos } = require("../account/accountFetcher")
const {getSuscpiciousListing} = require("../object/objectFetcher")

const getAdminSession = (req) => {
    if (req.session && req.session.admin){
        console.log("test")
        return { admin:req.session.admin, adminSession : 1}
    };
    throw new Error("No siren provided in query or session.");
};

const allUsers = async (req, res) => {
    try {
        const {admin, adminSession} = getAdminSession()
        if (adminSession){
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

const getSusObject = async (req, res) => {
    try{
        const {admin, adminSession} = getAdminSession()
        if (adminSession){
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

module.exports = { allUsers, getSusObject }