const {getResultOfQuery} = require('../db_utils/db_functions');

async function getObjectTypeLabels() {
    try {
        const query = "SELECT id_object_type, label FROM object_type";
        const result = await getResultOfQuery("vue_user", query);

        return result.reduce((acc, item) => {
            acc[item.id_object_type] = item.label;
            return acc;
        }, {});
    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

function replacePreferenceIdsWithLabels(preferences, labels) {
    const updatedPreferences = {};
    for (const [id, value] of Object.entries(preferences)) {
        const label = labels[id] || `Unknown ID: ${id}`;
        updatedPreferences[label] = value;
    }
    return updatedPreferences;
}

async function getSuscpiciousListing() {
    try {
        const query = "SELECT * FROM listing";
        const result = await getResultOfQuery("vue_user", query);
        return {result}
    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

module.exports = { getObjectTypeLabels, replacePreferenceIdsWithLabels , getSuscpiciousListing};
