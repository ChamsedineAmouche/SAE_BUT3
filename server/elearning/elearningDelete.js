const {getResultOfQuery} = require("../db_utils/db_functions");


async function deleteElearning(courseId) {
    try {
        const query =`DELETE FROM elearning_list WHERE course_id = ${courseId}`;
        console.log(query)
        const result = await getResultOfQuery("vue_admin", query);

    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}


module.exports = { deleteElearning};
