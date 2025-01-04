const {getDataForArticleListPage} = require("../articleList/articleListFetcher");
const getArticleList = async (req, res) => {
    console.log("Endpoint '/articleList' was called");
    try {
        const articleListData = await getDataForArticleListPage();
        res.json(articleListData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { getArticleList };