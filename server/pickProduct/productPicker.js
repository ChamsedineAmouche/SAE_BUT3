const getDbConnection = require("../db_utils/db_connection");

async function pickProductById(idItem, siren, status) {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        await promiseConnection.beginTransaction();

        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (status === 'reserved') {
            const [insertResult] = await promiseConnection.execute(
                `INSERT INTO transaction (status, date_transaction, id_item, siren) VALUES (?, ?, ?, ?)`, ['waiting', currentDate, idItem, siren]);
            const [updateResult] = await promiseConnection.execute(`UPDATE listing SET status = 'waiting' WHERE id_item = ${idItem}`);
            await promiseConnection.commit();
        } else if (status === 'waiting') {
            const [insertResult] = await promiseConnection.execute(
                `INSERT INTO transaction (status, date_transaction, id_item, siren) VALUES (?, ?, ?, ?)`, ['picked', currentDate, idItem, siren]);
            const [updateResult] = await promiseConnection.execute(`UPDATE listing SET status = 'picked' WHERE id_item = ${idItem}`);
            const [deleteResult] = await promiseConnection.execute(`DELETE FROM listing_favorites WHERE id_item = ${idItem}`)
            await promiseConnection.commit();
        } else {
            console.error('Tu peux pas récuperer ce produit il a pas encore été réservé.');
            await promiseConnection.rollback();
        }
    } catch (error) {
        await promiseConnection.rollback();
        console.error('Erreur lors de la reservation, transaction annulée :', error);
    } finally {
        await promiseConnection.end();
    }
}

module.exports = { pickProductById };
