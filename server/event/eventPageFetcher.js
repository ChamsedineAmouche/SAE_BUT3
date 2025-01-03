const {getResultOfQuery} = require('../db_utils/db_functions');
const {insertNewInscriptionForEvent} = require('../db_utils/db_insertion')
const {getCapacityRemaining, getDataOfTheEvent, getNumberOfParticipants} = require('./utils_event')

const mysql = require('mysql2');

async function getDataForEventPage(id) {
    try {
        const dataOfEvent = await getDataOfTheEvent(id);
        const companyInEvent = await getInscriptionCompany(id);
        const numberOfParticipants = await getNumberOfParticipants(id);
        const capacityRemaining = await getCapacityRemaining(dataOfEvent, numberOfParticipants);
        return {
            "eventData" : dataOfEvent,
            "companyInEvent" : companyInEvent,
            "numberOfParticipants" : numberOfParticipants,
            "capacityRemaining" : capacityRemaining
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erreur interne de vérification" };
    }
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

async function inscrireEvent(eventId, siren) {
    try {
        await insertNewInscriptionForEvent(eventId, siren);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

module.exports = { getDataForEventPage, inscrireEvent };