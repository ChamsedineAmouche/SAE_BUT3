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
        const deleteImagesResult = await getResultOfQuery("vue_user", deleteImagesQuery);

        const deleteTransactionQuery = `DELETE FROM transaction WHERE id_item = ${idItem}`;
        const deleteTransactionResult = await getResultOfQuery("vue_user", deleteTransactionQuery);

        const deleteObjectQuery = `DELETE FROM listing WHERE id_item = ${idItem}`;
        const deleteObjectResult = await getResultOfQuery("vue_user", deleteObjectQuery);

        // Vérifie si un objet a été supprimé
        if (deleteObjectResult.affectedRows === 0) {
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        throw new Error("Erreur lors de la suppression de l'objet");
    }
}

module.exports = { deleteObjectFavorite , deleteObject};
