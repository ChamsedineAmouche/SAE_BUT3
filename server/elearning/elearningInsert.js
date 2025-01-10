const {getResultOfQuery} = require("../db_utils/db_functions");
const crypto = require('crypto');

async function insertElearning(course_id, siren) {
    try {
        const queryFetch = `SELECT * FROM elearning WHERE course_id = ` + course_id;
        eLearning = await getResultOfQuery("vue_admin", queryFetch);
        const {course_id : courseId, title : title, description : description, price : price, category : category} = eLearning

        const token = crypto.randomBytes(64).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const queryInsert = `INSERT INTO elearning (title, description, price, subscription_date, token, password, course_id, siren, category, favorite) VALUES ('${title}', '${description}', '${price}', '${CURDATE()}', '${token}'`

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

async function getElearningCategory(){
    try {
        const query = `SELECT * FROM category`;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

module.exports = { addFavorite, deleteFavorite };