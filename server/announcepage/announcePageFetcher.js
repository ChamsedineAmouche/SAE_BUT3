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
                ' SELECT c.adress,  c.city, c.zipcode, c.capacity FROM container c JOIN emplacement e ON e.id_Container = c.id_Container WHERE e.available = 1 AND c.capacity > 0 GROUP BY c.id_Container;');
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
        const idItem = await insertListingWithImages(newSubmission, siren);
        return idItem
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


module.exports = {getCategoriesForObjects, getLocalisationOfStockage, getStatesForObjects, insertNewObject};