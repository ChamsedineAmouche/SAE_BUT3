const mysql = require('mysql2');

function execute_query(connection, query) {
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

module.exports = execute_query;

