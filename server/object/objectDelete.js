const {getResultOfQuery} = require('../db_utils/db_functions');


async function deleteObjectFavorite(idItem, siren) {
    try {
        const query =`DELETE FROM listing_favorites WHERE siren = '${siren}' and id_item = ${idItem}`;
        const result = await getResultOfQuery("vue_user", query);

    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

async function deleteObject(idItem) {
    try {
        const query =`DELETE FROM listing WHERE id_item = ${idItem}`;
        console.log(query)
        const result = await getResultOfQuery("vue_user", query);

    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

module.exports = { deleteObjectFavorite , deleteObject};
