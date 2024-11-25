//A remplir avec le template de db_connection
module.exports = {
    connect: () => {
        console.log('Default connect function called.');
        return {};  // Retourne une fausse connexion
    },
    query: (sql, params) => {
        console.log(`Default query function called with SQL: ${sql}`);
        return Promise.resolve([]);  // Simule une réponse vide
    },
};