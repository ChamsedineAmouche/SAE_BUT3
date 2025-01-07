const {getResultOfQuery} = require('../db_utils/db_functions');

const mysql = require('mysql2');

async function getDataForArticlePage(id) {
    try {
        const dataOfArticle = await getDataOfTheArticle(id);
        const lastArticles = await getOtherArticle(id);
        return {
            "articleData" : dataOfArticle,
            "lastArticles" : lastArticles
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function getDataOfTheArticle(id) {
    const query = `SELECT id_veille, title, article_date, author, content, image, category
                   FROM article WHERE id_veille = ` + id;
    return await getResultOfQuery("vue_admin", query);
}

async function getOtherArticle(id) {
    const query = `
        SELECT id_veille, title, article_date, author, content, image, category
        FROM article
        WHERE id_veille != ${id}
        ORDER BY article_date DESC
    `;
    return await getResultOfQuery('vue_admin', query);
}

module.exports = { getDataForArticlePage };