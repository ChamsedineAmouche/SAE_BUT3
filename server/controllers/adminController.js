const { getAllAccountsInfos } = require("../account/accountFetcher")

const allUsers = async (req, res) => {
    try {
        const result = await getAllAccountsInfos();
        if (!result.success) {
            return res.status(500).json({ message: result.message });
        }
        res.json({ users: result.users, inscriptions: result.inscriptions });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur' });
    }
};

module.exports = { allUsers }