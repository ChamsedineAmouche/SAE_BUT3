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
        const deleteImagesQuery = `DELETE FROM listing_image WHERE id_item = ${idItem}`;
        await getResultOfQuery("vue_user", deleteImagesQuery);

        const deleteObjectquery =`DELETE FROM listing WHERE id_item = ${idItem}`;
        const result = await getResultOfQuery("vue_user", deleteObjectquery);

        if (result.length === 0) {
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

module.exports = { deleteObjectFavorite , deleteObject};
