const { getDataForCatalogEventPage } = require('../catalogEvent/catalogEventFetcher')


const catalogEvent = async (req, res) => {
    console.log("Endpoint '/catalogEvent' was called");
    try {
        const catalogData = await getDataForCatalogEventPage();
        res.json(catalogData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { catalogEvent };