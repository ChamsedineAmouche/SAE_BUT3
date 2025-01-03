const {getResultOfQuery} = require('../db_utils/db_functions');

const mysql = require('mysql2');

async function getDataForEventPage(id) {
    try {
        const dataOfEvent = await getDataOfTheEvent(id);
        const companyInEvent = await getInscriptionCompany(id);
        const capacityRemaining = await getCapacityRemaining(dataOfEvent);
        return {
            "eventData" : dataOfEvent,
            "companyInEvent" : companyInEvent,
            "capacityRemaining" : capacityRemaining
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function getDataOfTheEvent(id) {
    const query = `SELECT * FROM event WHERE event_id = ` + id;
    return await getResultOfQuery("vue_user", query);
}

async function getInscriptionCompany(id) {
    const query = `SELECT siren FROM inscription WHERE event_id = ` + id;
    const result = await getResultOfQuery("vue_user", query);
    const company = [];

    for (let row of result) {
        if (row.siren) {
            company.push(row.siren);
        }
    }

    return company;
}

async function getCapacityRemaining(dataOfEvent) {
    const query = `SELECT COUNT(*) AS number FROM inscription WHERE event_id = ` + dataOfEvent[0].event_id;
    const result = await getResultOfQuery("vue_user", query);

    return dataOfEvent[0].capacity - result[0].number;
}

module.exports = { getDataForEventPage };