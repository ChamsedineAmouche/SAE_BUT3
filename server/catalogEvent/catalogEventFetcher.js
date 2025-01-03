const {getResultOfQuery} = require("../db_utils/db_functions");

async function getDataForCatalogEventPage() {
    try {
        const allOfEvents = await getResultOfQuery('vue_user', `SELECT * FROM event`);
        return {
            "events" : await getFilteredEvents(allOfEvents)
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function getFilteredEvents(allOfEvents) {
    const result = {};
    console.log(allOfEvents);
    for (const obj of allOfEvents) {
        const temporality = obj.status;

        if (!result[temporality]) {
            result[temporality] = [];
        }

        result[temporality].push(obj);
    }

    return result;
}

module.exports = { getDataForCatalogEventPage };