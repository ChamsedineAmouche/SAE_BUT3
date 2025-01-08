const {getResultOfQuery} = require("../db_utils/db_functions");
const {getNumberOfParticipants, getCapacityRemaining, getDataOfTheEvent} = require("../event/utils_event");
const {all} = require("express/lib/application");

async function getDataForCatalogEventPage() {
    try {
        const allOfEvents = await getResultOfQuery('vue_user', `SELECT * FROM event`);
        const eventsCapacity = [];
        for (const event of allOfEvents) {
            const eventData = await getDataOfTheEvent(event.event_id);
            const numberOfParticipants = await getNumberOfParticipants(event.event_id);
            const capacityRemaining = await getCapacityRemaining(eventData, numberOfParticipants);

            eventsCapacity.push({
                eventId: event.event_id,
                numberOfParticipants: numberOfParticipants[0].number,
                capacityRemaining,
            });
            console.log("eventsCapacity:", eventsCapacity);
        }
        return {
            "events" : await getFilteredEvents(allOfEvents),
            "eventsCapacity" : eventsCapacity
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