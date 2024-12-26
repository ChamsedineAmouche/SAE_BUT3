const { getAccountInfo } = require("../account/accountFetcher")

const profile = async (req, res) => {
    try {
        const { siren } = req.session.user;
        if (req.session.user) {
            profileData = await getAccountInfo(siren);
            const {nom, email, adress, password, zipcode, phone} = profileData.account[0];
            return res.json({ siren, nom, email, adress, password, zipcode, phone });
        }
        else {
            res.json("");
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};


module.exports = { profile };