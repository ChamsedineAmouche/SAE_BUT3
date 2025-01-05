const {getDataForArticlePage} = require("../articlepage/articlePageFetcher");

const getArticlePage = async (req, res) => {
    console.log("Endpoint '/articleList' was called");
    try {
        const {id} = req.query;
        const articlePageData = await getDataForArticlePage(id);
        res.json(articlePageData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { getArticlePage };