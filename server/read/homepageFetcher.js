const getDbConnection = require('../db_utils/db_connection');
const execute_query = require('../db_utils/db_functions');

const mysql = require('mysql2');

async function fetchData() {
    try {
        const connection = getDbConnection('vue_user');
        const query = 'SELECT * FROM company';
        const result = await execute_query(connection, query);

        console.log('Résultats de la requête :', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

function fetchData2() {
    return {test1: ["je suis", "juste un", "chill guy"]}
}

module.exports = {fetchData, fetchData2};