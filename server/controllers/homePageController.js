const { getDataForHomePage } = require('../homepage/homepageFetcher');

const getHomepageData = async (req, res) => {
    try {
        const homepagedata = await getDataForHomePage();
        res.json(homepagedata);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { getHomepageData };