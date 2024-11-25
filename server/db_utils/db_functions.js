const mysql = require('mysql2');
const getDbConnection = require("./db_connection");

function executeQuery(connection, query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            connection.end();
            if (err) {
                reject({ error: `Erreur lors de l'exécution de la requête` });
            } else {
                resolve(results);
            }
        });
    });
}

function getResultOfQuery(vue, query) {
    const connection = getDbConnection(vue);
    return executeQuery(connection, query);
}

function insertIntoDatabase(vue, query, values) {
    const connection = getDbConnection(vue)
    connection.execute(query, values, (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err);
        }
        console.log('Données insérées avec succès:', results);
    });
}

module.exports = { getResultOfQuery, insertIntoDatabase };

