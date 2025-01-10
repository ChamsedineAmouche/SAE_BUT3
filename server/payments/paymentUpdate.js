const crypto = require('crypto');
const { getResultOfQuery } = require('../db_utils/db_functions');

async function updateCardById(cardId, siren, cardName ,firstName, lastName) {
    try {
        const query = `UPDATE FROM payment_cards WHERE id=${cardId} and siren=${siren} SET card_name=${cardName} and card_holder_first_name=${firstName} and card_holder_last_name=${lastName}`;
        await getResultOfQuery("payment_data", query);
    } catch (error) {
        console.error('Erreur lors de la suppression de la carte :', error);
        throw new Error("Erreur lors de la suppression de la carte.");
    }
}

async function updateId(newDefault, cardId, siren){
    const updateQuery = `UPDATE payment_cards SET is_default=${newDefault} WHERE id=${cardId} and siren=${siren}`;
    await getResultOfQuery("payment_data", updateQuery);
}

async function updateDefaultByID(cardId, siren) {
    try {
        const selectQuery = `SELECT is_default FROM payment_cards WHERE id=${cardId} and siren=${siren}`;
        const result = await getResultOfQuery("payment_data", selectQuery);
        if (result.length === 0) {throw new Error('Carte non trouvée.');}
        const currentDefault = result[0].is_default;
        const newDefault = currentDefault === 0 ? 1 : 0;
        if (newDefault === 1) {
            const existingDefaultQuery = `SELECT id FROM payment_cards WHERE siren=${siren} AND is_default=1`;
            const existingDefaultCard = await getResultOfQuery("payment_data", existingDefaultQuery);
            if (existingDefaultCard.length > 0) {
                throw new Error("Une autre carte est déjà définie comme carte par défaut.");}}
        updateId(newDefault, cardId, siren)
        console.log(`La valeur de 'default' a été mise à jour avec succès pour la carte ${cardId}.`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la carte :', error);
        throw new Error("Erreur lors de la mise à jour de la carte.");
    }
}


module.exports = { updateCardById, updateDefaultByID };
