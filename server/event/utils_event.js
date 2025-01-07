const {getResultOfQuery} = require("../db_utils/db_functions");

async function getCapacityRemaining(dataOfEvent, number) {
    return dataOfEvent[0].capacity - number[0].number;
}

async function getDataOfTheEvent(id) {
    const query = `SELECT * FROM event WHERE event_id = ` + id;
    return await getResultOfQuery("vue_user", query);
}

async function getNumberOfParticipants(id) {
    const query = `SELECT COUNT(*) AS number FROM inscription WHERE event_id = ` + id;
    return await getResultOfQuery("vue_user", query);
}

module.exports = {getCapacityRemaining, getDataOfTheEvent, getNumberOfParticipants}