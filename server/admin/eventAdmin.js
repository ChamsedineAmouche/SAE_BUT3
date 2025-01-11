const {getResultOfQuery} = require('../db_utils/db_functions');

const mysql = require('mysql2');
const getDbConnection = require("../db_utils/db_connection");
const FileType = require("file-type");

async function getAllEvents() {
    try {
        const query = "SELECT * FROM event";
        const result = await getResultOfQuery("vue_admin", query);
  
        if (result.length === 0) {
            console.log("Pas d'évènements");
            return { success: true, message: "Pas d'évènements", events : {} };
        }

        return { success: true, message: "", events : result};
    } catch (error) {
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function insertEventAdmin(newSubmission, req) {
    try {
        const admin = req.session.admin;
        if (admin) {
            const connection = getDbConnection('vue_user');
            const promiseConnection = connection.promise();
            const connection_admin = getDbConnection('vue_admin');
            const promiseConnectionAdmin = connection_admin.promise();
            try {
                await promiseConnection.beginTransaction();
                await promiseConnectionAdmin.beginTransaction();

                const { event_id, title, description, event_date, location, capacity, status } = newSubmission;

                const [listingResult] = await promiseConnection.execute(
                    `INSERT INTO event 
       (event_id, title, description, event_date, location, capacity, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [event_id, title, description, event_date, location, capacity, status]
                );
                const [listingResultAdmin] = await promiseConnectionAdmin.execute(
                    `INSERT INTO event 
       (id_event, title, description, event_date, location, capacity, status, admin_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [event_id, title, description, event_date, location, capacity, status, admin]
                );
                await promiseConnection.commit();
                await promiseConnectionAdmin.commit();
                console.log('Transaction réussie, données insérées avec succès.');
            } catch (error) {
                await promiseConnection.rollback();
                await promiseConnectionAdmin.rollback();
                console.error('Erreur lors de l\'insertion, transaction annulée :', error);
            } finally {
                await promiseConnection.end();
                await promiseConnectionAdmin.end();
            }
        } else {
            throw new Error("pas admin connecté");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

async function deleteEventAdmin(eventId, req) {
    try {
        const admin = req.session.admin;
        if (admin) {
            const connection = getDbConnection('vue_user');
            const promiseConnection = connection.promise();
            const connection_admin = getDbConnection('vue_admin');
            const promiseConnectionAdmin = connection_admin.promise();
            try {
                await promiseConnection.beginTransaction();
                await promiseConnectionAdmin.beginTransaction();

                const [listingResult] = await promiseConnection.execute(`DELETE FROM event WHERE event_id = ${eventId}`);
                const [listingResultAdmin] = await promiseConnectionAdmin.execute(`DELETE FROM event WHERE id_event = ${eventId}`);
                await promiseConnection.commit();
                await promiseConnectionAdmin.commit();

                return { success: true, message: "Transaction réussie, données supprimées avec succès."};
            } catch (error) {
                await promiseConnection.rollback();
                await promiseConnectionAdmin.rollback();
                return { success: false, message: 'Erreur lors de la suppression, transaction annulée : ' + error };
            } finally {
                await promiseConnection.end();
                await promiseConnectionAdmin.end();
            }
        } else {
            throw new Error("pas admin connecté");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return { success: false, message: 'Erreur lors de la suppression, transaction annulée : ' + error };
    }
}

module.exports = { insertEventAdmin, deleteEventAdmin, getAllEvents }