const {getResultOfQuery} = require('../db_utils/db_functions');


async function insertNewNotif(siren, message) {
    try {
        const query = `INSERT INTO notif (siren, message) VALUES (${siren}, '${message}')`;
        const result = await getResultOfQuery("vue_user", query);

    } catch (error) {
        throw new Error(`Erreur ${error}`);
    }
}

async function updateNotif(id) {
    try {
        const query = `UPDATE notif SET is_read = 1 WHERE id = ${id}`;
        const result = await getResultOfQuery("vue_user", query);
        return result;
    } catch (error) {
        throw new Error(`Erreur ${error}`);
    }
}


module.exports = { insertNewNotif, updateNotif};

