const mysql = require('mysql2');

// Fonction pour créer et connecter une base de données
function getDbConnection(database) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: database
    });

    // Connexion à MySQL
    connection.connect((err) => {
        if (err) {
            console.error(`Erreur de connexion à la base ${database}:`, err);
            throw err;
        }
    });

    return connection;
}

module.exports = getDbConnection;
