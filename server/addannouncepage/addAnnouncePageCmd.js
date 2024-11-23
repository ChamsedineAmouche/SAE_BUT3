const getDbConnection = require('../db_utils/db_connection');
const execute_query = require('../db_utils/db_functions');

const mysql = require('mysql2');

async function getCategoriesForObjects() {
    try {
        const connection = getDbConnection('vue_user');
        const query = 'SELECT label FROM object_type';
        const result = await execute_query(connection, query);
        console.log('Résultats de la requête :', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function getLocalisationOfStockage() {
    try {
        const connection = getDbConnection('vue_user');
        const query = 'SELECT adress, city, zipcode, capacity FROM container';
        const result = await execute_query(connection, query);
        const containerAvailable = result.filter(container => container.capacity > 0);
        console.log('Résultats de la requête :', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


module.exports = { getCategoriesForObjects, getLocalisationOfStockage };