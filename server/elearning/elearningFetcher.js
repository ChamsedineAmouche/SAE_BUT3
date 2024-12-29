const {getResultOfQuery} = require("../db_utils/db_functions");

async function getElearningBySiren(siren) {
    try {
        const query = `SELECT * FROM elearning WHERE siren = ` + siren;
        return await getResultOfQuery("vue_user", query);
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

async function getElearningByCategory() {
    try {
        const query = `
            SELECT 
                c.id AS id_category,
                c.Libelle AS label_category,
                COALESCE(
                    JSON_ARRAYAGG(
                        CASE 
                            WHEN e.course_id IS NOT NULL THEN
                                JSON_OBJECT(
                                    'course_id', e.course_id,
                                    'title', e.title,
                                    'description', e.description,
                                    'price', e.price,
                                    'admin_id', e.admin_id
                                )
                            ELSE NULL
                        END
                    ),
                    JSON_ARRAY() -- Retourner un tableau vide si aucune donnée
                ) AS elearning_info
            FROM vue_user.category c
            LEFT JOIN vue_admin.elearning_list e
            ON c.id = e.category
            GROUP BY c.id, c.Libelle
            ORDER BY c.id;
        `;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

module.exports = { getElearningBySiren, getElearningCategory, getElearningByCategory };