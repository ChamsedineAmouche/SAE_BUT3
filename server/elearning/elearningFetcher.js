const {getResultOfQuery} = require("../db_utils/db_functions");
const bcrypt = require("bcryptjs");

async function getElearningBySiren(siren) {
    try {
        const query = `SELECT e.*, c.Libelle AS categoryName FROM elearning e JOIN category c ON e.category = c.id WHERE siren =`  + siren;
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
    try {const query = `
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
                                    'admin_id', e.admin_id,
                                    'categoryName', c.Libelle
                                )
                            ELSE NULL
                        END
                    ),
                    JSON_ARRAY() -- Retourner un tableau vide si aucune donnée
                ) AS elearning_info
            FROM vue_user.category c
            LEFT JOIN vue_admin.elearning_list e
            ON c.id = e.category GROUP BY c.id, c.Libelle ORDER BY c.id;`;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;}
}
async function getElearningInfo(courseId){
    try{
    const query = `SELECT * FROM elearning_list WHERE course_id = ${courseId}`;
    console.log(query)
    result = await getResultOfQuery("vue_admin", query)
    console.log(result)
    return {success : "True", eLearning : result}
    }
    catch(error){
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }

}

async function getElearningDetail(id_elearning, siren){
    try {
        const query = `SELECT * FROM elearning WHERE siren = ${siren} and id_elearning = ${id_elearning}`;

        result = await getResultOfQuery("vue_user", query);
        console.log(result)
        if (result.length == 0){
            return {succes : "False", message : "Pas de eLearning acheté pour cette utilisateur"}
        }

        return {success : "True",  eLearning : result}

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

async function getElearningDetailEmployee(idElearning, password, token, siren) {
    try {
        const query = `SELECT password, token FROM elearning WHERE id_elearning=${idElearning} AND siren=${siren}`;
        const result = await getResultOfQuery("vue_user", query);

        // Vérifiez si le résultat est valide
        if (!result || result.length === 0) {
            return { success: false, message: "Pas de eLearning acheté pour cet utilisateur" };
        }

        // Extraire les données correctement
        const { password: elearningPassword, token: elearningToken } = result[0]; // Utilisez result[0] car SQL retourne un tableau d'objets
        console.log(elearningPassword, password)
        // Vérifiez si le token correspond
        if (elearningToken !== token) {
            return { success: false, message: "Les tokens ne correspondent pas" };
        }

        // Comparez le mot de passe
        const match = await bcrypt.compare(password, elearningPassword);
        if (!match) {
            return { success: false, message: "Mot de passe incorrect" };
        }

        // Récupérer les détails du eLearning
        return await getElearningDetail(idElearning, siren);

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}


module.exports = { getElearningBySiren, getElearningCategory, getElearningByCategory, getElearningDetail, getElearningDetailEmployee, getElearningInfo };