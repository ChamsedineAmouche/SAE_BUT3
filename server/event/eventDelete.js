const {getResultOfQuery} = require('../db_utils/db_functions');

async function deleteInscription(eventId, siren) {
    try {
        const query =`DELETE FROM inscription WHERE siren = '${siren}' and event_id = ${eventId}`;
        const result = await getResultOfQuery("vue_user", query);

    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}


module.exports = { deleteInscription };