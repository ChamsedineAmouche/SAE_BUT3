const mysql = require('mysql2');
     
// Fonction pour se connecter une base de données
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
        console.log(`Connecté à la base ${database}`);
    });

    return connection;
}

module.exports = getDbConnection;
 