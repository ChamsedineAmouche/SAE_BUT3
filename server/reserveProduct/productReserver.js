const {getResultOfQuery} = require('../db_utils/db_functions');
const getDbConnection = require("../db_utils/db_connection");

async function reserveProductInDataBase(idItem, siren) {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        await promiseConnection.beginTransaction();

        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(currentDate);
        console.log(idItem);
        console.log(siren);
        const [insertResult] = await promiseConnection.execute(
            `INSERT INTO transaction (status, date_transaction, id_item, siren) VALUES (?, ?, ?, ?)`, ['reserved', currentDate, idItem, siren]);
        const [updateResult] = await promiseConnection.execute(`UPDATE listing SET status = 'reserved' WHERE id_item = ${idItem}`);

        await promiseConnection.commit();
    } catch (error) {
        await promiseConnection.rollback();
        console.error('Erreur lors de la reservation, transaction annulée :', error);
    } finally {
        await promiseConnection.end();
    }
}

module.exports = { reserveProductInDataBase };
