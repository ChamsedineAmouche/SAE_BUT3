const {getResultOfQuery} = require("../db_utils/db_functions");
const crypto = require('crypto');
const bcrypt = require("bcryptjs");

function generateRandomPassword() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specialChars = "!@$%^*()-_=+[]{}|,.<>`~";

    const requiredChars = [
        uppercase[Math.floor(Math.random() * uppercase.length)],
        lowercase[Math.floor(Math.random() * lowercase.length)],
        digits[Math.floor(Math.random() * digits.length)],
        digits[Math.floor(Math.random() * digits.length)],
        specialChars[Math.floor(Math.random() * specialChars.length)]
    ];

    const allChars = uppercase + lowercase + digits + specialChars;
    while (requiredChars.length < 10) {
        requiredChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    return requiredChars.sort(() => Math.random() - 0.5).join('');
}

function escapeApostrophes(value) {
    return value.replace(/'/g, "''");
}

async function insertElearning(course_id, siren) {
    try {
        const queryFetch = `SELECT * FROM elearning_list WHERE course_id = ` + course_id;
        eLearning = await getResultOfQuery("vue_admin", queryFetch);
        const {course_id : courseId, title : title, description : description, price : price, category : category} = eLearning[0]
        const token = crypto.randomBytes(32).toString('hex');
        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        var escapeTitle = escapeApostrophes(title)
        var escapeDesc = escapeApostrophes(description)

        const queryInsert = `INSERT INTO elearning (title, description, price, subscription_date, token, password, course_id, siren, category) VALUES
        ('${escapeTitle}', '${escapeDesc}', '${price}', CURDATE(), '${token}', '${hashedPassword}', ${courseId}, '${siren}', '${category}')`;
        result = await getResultOfQuery("vue_user", queryInsert);

        const queryFetch2 = `SELECT id_elearning FROM elearning WHERE course_id = ${course_id} and siren = ${siren}`;
        resultFetch = await getResultOfQuery("vue_user", queryFetch2);
        const { id_elearning : idElearning } = resultFetch[0]
        return {password : password, token : token, idElearning : idElearning }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}


module.exports = { insertElearning };