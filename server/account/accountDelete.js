const { getResultOfQuery } = require("../db_utils/db_functions");


async function deleteInscriptions(siren) {
    try {
        const query = `DELETE FROM company WHERE siren = '${siren}'`;
        console.log(query);
        const result = await getResultOfQuery("vue_user", query);
        if (result.length === 0) {
            console.log("Pas d'entreprise avec ce siren en attente d'inscriptions");
            return { success: True, message: "Pas d'inscriptions en cours", account : {} };
        }

        return { success: true, message: "Company supprimé", account : result};
    } catch (error) {
        return { success: false, message: "Erreur interne de vérification" };
    }
}
  
module.exports = { deleteInscriptions };
  