const mysql = require('mysql2');
const {getResultOfQuery} = require("../db_utils/db_functions");

async function getDataForCatalogPage() {
  try {
    const allOfObjects =
            await getResultOfQuery('vue_user', 'SELECT * FROM listing');
    const allOfObjectStateForFilters =
            await getResultOfQuery('vue_user', 'SELECT * FROM condition_type');
    const allOfObjectTypeForFilters=
            await getResultOfQuery('vue_user', 'SELECT * FROM object_type')

    return {
      "objects" : allOfObjects,
      "objectStates" : allOfObjectStateForFilters,
      "objectTypes" : allOfObjectTypeForFilters,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

module.exports = { getDataForCatalogPage };