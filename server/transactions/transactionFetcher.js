const {getResultOfQuery} = require("../db_utils/db_functions");

async function getTransactiongBySiren(siren) {
    try {
        const query = `
        SELECT id_item, date_transaction, 
            CASE
                WHEN MAX(CASE WHEN status = 'picked' THEN 1 ELSE 0 END) = 1 THEN 'picked'
                ELSE 'reserved'
            END AS status
        FROM transaction
        WHERE siren = '${siren}'
        GROUP BY id_item, date_transaction;`;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}


module.exports = { getTransactiongBySiren };