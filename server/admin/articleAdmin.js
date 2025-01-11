const {getResultOfQuery} = require('../db_utils/db_functions');

const mysql = require('mysql2');
const getDbConnection = require("../db_utils/db_connection");
const FileType = require("file-type");

async function getAllArticles() {
    try {
        const query = "SELECT * FROM article";
        const result = await getResultOfQuery("vue_admin", query);
  
        if (result.length === 0) {
            console.log("Pas d'articles");
            return { success: true, message: "Pas d'articles", articles : {} };
        }

        return { success: true, message: "", articles: result };
    } catch (error) {
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function insertArticleAdmin(newSubmission, req) {
    try {
        const connection = getDbConnection('vue_admin');
        const promiseConnection = connection.promise();
        const admin = req.session.admin;
        if (admin) {
            try {
                await promiseConnection.beginTransaction();

                const { id_veille, title, article_date, author, content, category } = newSubmission;

                const [listingResult] = await promiseConnection.execute(
                    `INSERT INTO article 
       (id_veille, title, article_date, author, content, image, category, admin_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [id_veille, title, article_date, author, content, null, category, admin]
                );
                await promiseConnection.commit();
                console.log('Transaction réussie, données insérées avec succès.');
            } catch (error) {
                await promiseConnection.rollback();
                console.error('Erreur lors de l\'insertion, transaction annulée :', error);
            } finally {
                await promiseConnection.end();
            }
        } else {
            throw new Error("pas admin connecté");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function deleteArticleAdmin(articleId, req) {
    try {
        const admin = req.session.admin;
        if (admin) {
            const connection_admin = getDbConnection('vue_admin');
            const promiseConnectionAdmin = connection_admin.promise();
            try {
                await promiseConnectionAdmin.beginTransaction();

                const [listingResultAdmin] = await promiseConnectionAdmin.execute(`DELETE FROM article WHERE id_veille = ${articleId}`);
                await promiseConnectionAdmin.commit();
                console.log('Transaction réussie, données supprimées avec succès.');
                
                return { success: true, message: "Transaction réussie, données supprimées avec succès." };
            } catch (error) {
                await promiseConnectionAdmin.rollback();
                console.error('Erreur lors de l\'insertion, transaction annulée :', error);
                return { success: false, message: 'Erreur lors de la suppression, transaction annulée :' + error};
            } finally {
                await promiseConnectionAdmin.end();
            }
        } else {
            throw new Error("pas admin connecté");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

module.exports = {insertArticleAdmin, deleteArticleAdmin, getAllArticles}