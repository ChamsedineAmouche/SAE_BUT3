const {getResultOfQuery} = require('../db_utils/db_functions');

const mysql = require('mysql2');

async function getNumberOfGivenObjects() {
    try {
        const query = `SELECT COUNT(*) AS numberGiven FROM listing WHERE status = 'picked'`;
        const result = await getResultOfQuery("vue_user", query);

        if (result.length === 0) {
            console.log("Pas d'objets trouvés");
            return 0;
        }
        return result[0].numberGiven;
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function getNumberOfActiveObjects() {
    try {
        const query = `SELECT COUNT(*) AS numberGiven FROM listing WHERE status = 'active'`;
        const result = await getResultOfQuery("vue_user", query);

        if (result.length === 0) {
            console.log("Pas d'objets trouvés");
            return 0;
        }
        return result[0].numberGiven;
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function getNumberOfCompany() {
    try {
        const result =
            await getResultOfQuery('vue_user', 'SELECT COUNT(*) AS count FROM company');
        const count = result[0]?.count;
        return count;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function getDataForHomePage(){
    try {
        const numberOfCompany = await getNumberOfCompany();
        const numberGiven = await getNumberOfGivenObjects();
        const numberActive = await getNumberOfActiveObjects();
        const object = await getResultOfQuery('vue_user',
            `SELECT l.id_item, l.title, l.date_posted, ct.label AS state, ot.label AS category
            FROM listing l
            JOIN condition_type ct ON l.id_condition_type = ct.id_condition_type 
            JOIN object_type ot ON l.id_object_type = ot.id_object_type 
            WHERE l.status = "active"
            ORDER BY l.date_posted DESC;
            `);
        const event = await getResultOfQuery('vue_admin',
            'SELECT * FROM event');
        const elearning = await getResultOfQuery('vue_admin',
            'SELECT * FROM elearning_list');
        const article = await getResultOfQuery('vue_admin',
            'SELECT * FROM article ORDER BY article_date DESC');
        return {
            "numberOfCompany" : numberOfCompany,
            "numberGiven" : numberGiven,
            "numberActive" : numberActive,
            "object" : keepOnlyThe10LastPosted(object),
            "event" : keepOnlyThe10LastPosted(event),
            "elearning" : keepOnlyThe10LastPosted(elearning),
            "article" : keepOnlyThe10LastPosted(article)
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

function keepOnlyThe10LastPosted(results) {
    return results.slice(0, 10);
}


module.exports = { getDataForHomePage };
