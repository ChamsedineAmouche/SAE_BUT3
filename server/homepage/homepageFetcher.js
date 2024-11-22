const getDbConnection = require('../db_utils/db_connection');
const execute_query = require('../db_utils/db_functions');

const mysql = require('mysql2');

async function getNumberOfCompany() {
    try {
        const connection = getDbConnection('vue_user');
        const query = 'SELECT COUNT(*) AS count FROM company';
        const result = await execute_query(connection, query);
        const count = result[0]?.count;
        console.log('Résultats de la requête :', result);
        return count;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


module.exports = { getNumberOfCompany };
