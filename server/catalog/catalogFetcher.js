const mysql = require('mysql2');
const {getResultOfQuery} = require("../db_utils/db_functions");

async function getDataForCatalogPage() {
    try {
        const allOfObjects =
            await getResultOfQuery('vue_user', `SELECT l.id_item, l.title, l.date_posted, ct.label AS state, ot.label AS category
            FROM listing l
            JOIN condition_type ct ON l.id_condition_type = ct.id_condition_type 
            JOIN object_type ot ON l.id_object_type = ot.id_object_type 
            WHERE l.status = "active"
            ORDER BY l.date_posted DESC;
            `);
        const allOfObjectStateForFilters =
            await getResultOfQuery('vue_user', 'SELECT * FROM condition_type');
        const allOfObjectTypeForFilters=
            await getResultOfQuery('vue_user', 'SELECT * FROM object_type')
        const objectForFilter = getObjectForFilter(allOfObjects);
        return {
            "objects" : allOfObjects,
            "objectStates" : allOfObjectStateForFilters,
            "objectTypes" : allOfObjectTypeForFilters,
            "objectForFilter": objectForFilter
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

function getObjectForFilter(allOfObjects) {
    const result = {};

    allOfObjects.forEach(obj => {
        const { category, state, ...itemData } = obj;
        if (!result[category]) {
            result[category] = {};
        }
        if (!result[category][state]) {
            result[category][state] = [];
        }
        result[category][state].push(itemData);
    });

    return result;
}

module.exports = { getDataForCatalogPage };