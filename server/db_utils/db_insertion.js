const getDbConnection = require("./db_connection");
const {getResultOfQuery} = require('./db_functions')
const FileType = require("file-type");
const {getCapacityRemaining, getDataOfTheEvent, getNumberOfParticipants} = require("../event/utils_event");

const insertListingWithImages = async (newSubmission, siren) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        await promiseConnection.beginTransaction();

        const { title, description, dimensions, category, state, location, files } = newSubmission;
        const address = location.split(',')[0].trim();
        const idContainerResult = await getResultOfQuery('vue_user',
            'SELECT id_Container FROM container WHERE adress = ' + "'" + address + "'");
        const idContainer = idContainerResult[0].id_Container;
        const idEmplacementResult = await getResultOfQuery('vue_user',
            `SELECT id_emplacement FROM emplacement WHERE id_Container = ${idContainer} AND available = 1 LIMIT 1`);
        //console.log('Fichiers reçus (Base64) :', files);
        const stateIdRequest = await getResultOfQuery('vue_user',
            'SELECT id_condition_type FROM condition_type WHERE condition_type.label = ' + "'" + state + "'");
        const categoryIdRequest = await getResultOfQuery('vue_user',
            'SELECT id_object_type FROM object_type WHERE object_type.label = ' + "'" + category + "'");

        const dimensionString = `${dimensions.longueur}x${dimensions.largeur}x${dimensions.hauteur}`;
        const stateId = stateIdRequest[0].id_condition_type;
        const categoryId = categoryIdRequest[0].id_object_type;
        const status = "active";
        const idEmplacement = idEmplacementResult[0].id_emplacement;
        console.log("emplacement id: " + idEmplacement);

        const datePosted = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [listingResult] = await promiseConnection.execute(
            `INSERT INTO listing 
       (title, description, dimension, date_posted, status, id_emplacement, siren, id_object_type, id_condition_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, dimensionString, datePosted, status, idEmplacement, siren, categoryId, stateId]
        );

        const [updateResult] = await promiseConnection.execute(
            `UPDATE emplacement SET available = 0 WHERE id_emplacement = ?`, [idEmplacement]);

        const idItem = listingResult.insertId;
        for (const base64File of files) {
            const bufferToInsert = Buffer.from(base64File, 'base64');
            const fileType = await FileType.fromBuffer(bufferToInsert);
            console.log('Taille du buffer inséré :', bufferToInsert.length);

            await promiseConnection.execute(
                `INSERT INTO listing_image (image, id_item, mime_type) VALUES (?, ?, ?)`,
                [bufferToInsert, idItem, fileType.mime]);
        }

        //console.log(`Images associées à l'idItem: ${idItem}`);

        await promiseConnection.commit();
        console.log('Transaction réussie, données insérées avec succès.');
    } catch (error) {
        await promiseConnection.rollback();
        console.error('Erreur lors de l\'insertion, transaction annulée :', error);
    } finally {
        await promiseConnection.end();
    }
};

const insertNewInscriptionForEvent = async (eventId, siren) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();

    try {
        await promiseConnection.beginTransaction();
        const dataEvent = await getDataOfTheEvent(eventId);
        const number = await getNumberOfParticipants(eventId);
        const capacity = await getCapacityRemaining(dataEvent, number);
        if (capacity > 0) {
            await promiseConnection.execute(
                `INSERT INTO inscription (event_id, siren) VALUES (?, ?)`,
                [eventId, siren]
            );
            await promiseConnection.commit();
            console.log('Transaction réussie, données insérées avec succès.');
        }
    } catch (error) {
        await promiseConnection.rollback();
        console.error('Erreur lors de l\'insertion, transaction annulée :', error);
    } finally {
        await promiseConnection.end();
    }
}

module.exports = { insertNewInscriptionForEvent, insertListingWithImages };