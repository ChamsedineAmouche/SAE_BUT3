const {getResultOfQuery} = require('../db_utils/db_functions');

const mysql = require('mysql2');
const getDbConnection = require("../db_utils/db_connection");
const FileType = require("file-type");

async function insertElearningAdmin(newSubmission, req) {
    try {
        const connection = getDbConnection('vue_admin');
        const promiseConnection = connection.promise();
        const admin = req.session.admin;

        if (admin) {
            try {
                await promiseConnection.beginTransaction();

                const { title, description, price, category } = newSubmission;

                const [listingResult] = await promiseConnection.execute(
                    `INSERT INTO elearning_list 
       (title, description, price, category, admin_id) 
       VALUES (?, ?, ?, ?, ?)`,
                    [title, description, price, category, admin.id]
                );
                await promiseConnection.commit();
                console.log('Transaction réussie, données insérées avec succès.');
                return { success: true, message: 'Données insérées avec succès.' };
            } catch (error) {
                await promiseConnection.rollback();
                console.error('Erreur lors de l\'insertion, transaction annulée :', error);
                return { success: false, message: 'Erreur lors de l\'insertion.' };
            } finally {
                await promiseConnection.end();
            }
        } else {
            throw new Error("pas admin connecté");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return { success: false, message: 'Erreur interne du serveur.' };
    }
}

module.exports = {insertElearningAdmin}