const {getResultOfQuery} = require('../db_utils/db_functions');


async function getNumberOfCompany() {
    try {
        const result =
            await getResultOfQuery('vue_user', 'SELECT COUNT(*) AS count FROM company');
        const count = result[0]?.count;
        console.log('Résultats de la requête :', result);
        console.log("chill guy mec")
        return count;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


module.exports = { getNumberOfCompany };
