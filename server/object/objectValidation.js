const getDbConnection = require("../db_utils/db_connection");

async function validateObject(idItem) {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    
    try {
        const validation = "true";

        await promiseConnection.beginTransaction();

        const [result] = await promiseConnection.execute(
            `UPDATE listing SET valid = ? WHERE id_item = ?`,
            [validation, idItem]
        );

        await promiseConnection.commit();

        return result; // Retourne le résultat pour exploitation dans adminController.js
    } catch (error) {
        await promiseConnection.rollback();
        console.error("Erreur lors de la validation de l'objet :", error);
        throw new Error("Erreur lors de la validation de l'objet.");
    } finally {
        await promiseConnection.end();
    }
}

module.exports = { validateObject };