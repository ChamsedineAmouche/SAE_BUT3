const { getDataForCatalogPage } = require('../catalog/catalogFetcher')


const catalog = async (req, res) => {
    console.log("Endpoint '/catalog' was called");
    try {
        const catalogData = await getDataForCatalogPage();
        res.json(catalogData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { catalog };