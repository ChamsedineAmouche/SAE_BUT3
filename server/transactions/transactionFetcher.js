const {getResultOfQuery} = require("../db_utils/db_functions");

async function getTransactiongBySiren(siren) {
    try {
        const query = `
        SELECT 
            t.id_item,
            t.status,
            t.date_transaction
        FROM transaction t
        JOIN (
            SELECT id_item, MAX(date_transaction) AS max_date
            FROM transaction
            GROUP BY id_item
        ) latest ON t.id_item = latest.id_item AND t.date_transaction = latest.max_date
        JOIN listing l ON t.id_item = l.id_item 
         WHERE t.siren = ${siren}
         AND t.siren != l.siren;`;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

async function getTransactionSourceBySiren(siren) {
    try {
        const query = `
        SELECT 
            t.id_item,
            t.status,
            t.date_transaction,
            t.siren
        FROM transaction t
        JOIN (
            SELECT id_item, MAX(date_transaction) AS max_date
            FROM transaction
            GROUP BY id_item
        ) latest ON t.id_item = latest.id_item AND t.date_transaction = latest.max_date
        JOIN listing l ON t.id_item = l.id_item
        WHERE l.siren = ${siren};`;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

module.exports = { getTransactiongBySiren, getTransactionSourceBySiren };