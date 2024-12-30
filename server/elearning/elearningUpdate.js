const { getResultOfQuery } = require("../db_utils/db_functions");

async function addFavorite(siren, elearningid) {
    try{
    const query = `UPDATE elearning SET favorite ='1'  WHERE siren = '${siren}' and id_elearning = '${elearningid}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Elearning ajouté en favori" };}
    catch(error){
        console.error("Erreur d'ajout" + error)
        return { success: false, message: "Erreur d'ajout" };
    }
}

async function deleteFavorite(siren, elearningid) {
    try{
    const query = `UPDATE elearning SET favorite ='0'  WHERE siren = '${siren}' and id_elearning = '${elearningid}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Elearning ajouté en favori" };}
    catch(error){
        console.error("Erreur d'ajout" + error)
        return { success: false, message: "Erreur d'ajout" };
    }
}

module.exports = { addFavorite, deleteFavorite };