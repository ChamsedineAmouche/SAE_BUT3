const getDbConnection = require("./db_connection");
const {getResultOfQuery} = require('./db_functions')
const FileType = require("file-type");
const {getCapacityRemaining, getDataOfTheEvent, getNumberOfParticipants} = require("../event/utils_event");

const insertListingWithImages = async (newSubmission) => {
    const connection = getDbConnection('vue_user');
    const promiseConnection = connection.promise();
    try {
        await promiseConnection.beginTransaction();

        const { title, description, dimensions, category, state, location, files } = newSubmission;

        //console.log('Fichiers reçus (Base64) :', files);
        const stateIdRequest = await getResultOfQuery('vue_user',
            'SELECT id_condition_type FROM condition_type WHERE condition_type.label = ' + "'" + state + "'");
        const categoryIdRequest = await getResultOfQuery('vue_user',
            'SELECT id_object_type FROM object_type WHERE object_type.label = ' + "'" + category + "'");

        const dimensionString = `${dimensions.longueur}x${dimensions.largeur}x${dimensions.hauteur}`;
        const stateId = stateIdRequest[0].id_condition_type;
        const categoryId = categoryIdRequest[0].id_object_type;
        const status = "active";
        const idEmplacement = 7;
        const siren = "18770918300235";

        // Générer la date actuelle (au format YYYY-MM-DD HH:mm:ss pour MySQL)
        const datePosted = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [listingResult] = await promiseConnection.execute(
            `INSERT INTO listing 
       (title, description, dimension, date_posted, status, id_emplacement, siren, id_object_type, id_condition_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, dimensionString, datePosted, status, idEmplacement, siren, categoryId, stateId]
        );

        // Récupérer l'ID auto-incrémenté
        const idItem = listingResult.insertId;
        //console.log(`Données insérées dans la table listing avec idItem: ${idItem}`);

        // Insérer chaque image dans la table `listing_image`
        //console.log('Type de files:', typeof files);
       // console.log('Contenu de files:', files);
        for (const base64File of files) {
            const bufferToInsert = Buffer.from(base64File, 'base64');
            const fileType = await FileType.fromBuffer(bufferToInsert);
            console.log('Taille du buffer inséré :', bufferToInsert.length);

            await promiseConnection.execute(
                `INSERT INTO listing_image (image, id_item, mime_type) VALUES (?, ?, ?)`,
                [bufferToInsert, idItem, fileType.mime]);
        }

        //console.log(`Images associées à l'idItem: ${idItem}`);

        // Valider la transaction
        await promiseConnection.commit();
        console.log('Transaction réussie, données insérées avec succès.');
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await promiseConnection.rollback();
        console.error('Erreur lors de l\'insertion, transaction annulée :', error);
    } finally {
        // Fermer la connexion
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