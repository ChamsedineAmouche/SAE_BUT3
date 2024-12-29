const {getResultOfQuery} = require("../db_utils/db_functions");

async function getElearningBySiren(siren) {
    try {
        const query = `SELECT * FROM elearning WHERE siren = ` + siren;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}


module.exports = { getElearningBySiren };