

const {getResultOfQuery} = require("../db_utils/db_functions");

async function getAdressContainerByEmplacement(idEmplacement) {
    try {
        const query = `
        SELECT c.adress, c.zipcode
        FROM emplacement e
        JOIN container c ON e.id_container = c.id_container
        WHERE e.id_emplacement = ${idEmplacement}; `;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}


module.exports = { getAdressContainerByEmplacement };