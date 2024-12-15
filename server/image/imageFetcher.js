const mysql = require('mysql2');
const {getResultOfQuery} = require("../db_utils/db_functions");

async function getImage() {
  try {
    const images = getResultOfQuery('vue_user', 'SELECT image FROM listing_image');
    return images;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

module.exports = { getImage };