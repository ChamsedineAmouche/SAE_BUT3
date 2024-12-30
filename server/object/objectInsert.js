const {getResultOfQuery} = require('../db_utils/db_functions');

async function addObjectFavorite(idItem, siren) {
    try {
        const query = ` INSERT INTO listing_favorites (id_item, siren) VALUES (${idItem}, ${siren})`;
        const result = await getResultOfQuery("vue_user", query);

    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

module.exports = { addObjectFavorite };
