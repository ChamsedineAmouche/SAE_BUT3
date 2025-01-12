const {getResultOfQuery} = require('../db_utils/db_functions');
const {insertListingWithImages} = require('../db_utils/db_insertion')

const mysql = require('mysql2');

async function getCategoriesForObjects() {
    try {
        const result =
            await getResultOfQuery('vue_user', 'SELECT label FROM object_type');
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function getLocalisationOfStockage() {
    try {
        const result =
            await getResultOfQuery('vue_user',
                'SELECT adress, city, zipcode, capacity FROM container');
        const containerAvailable = result.filter(container => container.capacity > 0);
        return containerAvailable;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function getStatesForObjects() {
    try {
        const result =
            await getResultOfQuery('vue_user', 'SELECT label FROM condition_type');
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function insertNewObject(newSubmission, siren) {
    try {
        await insertListingWithImages(newSubmission, siren);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


module.exports = {getCategoriesForObjects, getLocalisationOfStockage, getStatesForObjects, insertNewObject};