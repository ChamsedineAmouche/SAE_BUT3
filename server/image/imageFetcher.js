const mysql = require('mysql2');
const {getResultOfQuery} = require("../db_utils/db_functions");

async function getImageById(id) {
    try {
        const query = `SELECT image, mime_type FROM listing_image WHERE id_item = ` + id;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

module.exports = { getImageById };