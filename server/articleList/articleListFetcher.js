const {getResultOfQuery} = require("../db_utils/db_functions");

async function getDataForArticleListPage() {
    try {
        const allOfArticles = await getResultOfQuery('vue_admin', `SELECT id_veille, title, article_date, author, content, image, category 
                FROM article 
                ORDER BY article_date DESC `);
        return {
            "articles" : allOfArticles
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

module.exports = {getDataForArticleListPage}