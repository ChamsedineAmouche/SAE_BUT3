const crypto = require('crypto');
const { getResultOfQuery } = require('../db_utils/db_functions');

async function deleteCardById(cardId, siren) {
    try {
        const query = `DELETE FROM payment_cards WHERE id=${cardId} and siren=${siren}`;
        console.log("Executing query:", query);
        await getResultOfQuery("payment_data", query);
    } catch (error) {
        console.error('Erreur lors de la suppression de la carte :', error);
        throw new Error("Erreur lors de la suppression de la carte.");
    }
}



module.exports = { deleteCardById };
