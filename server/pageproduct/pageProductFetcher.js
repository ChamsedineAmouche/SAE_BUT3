const mysql = require('mysql2');
const {getResultOfQuery} = require("../db_utils/db_functions");

async function getDataForProductPageById(id, currentSiren) {
    const productData = await getProductDataById(id);
    const productWithSameCat = await getAllProductDataWithSameCategories(productData[0].id_object_type, id);
    const company = await getCompanyDataBySiren(productData[0].siren);
    const localisation = await getLocalisationOfObject(productData[0].id_emplacement);
    let currentCompany = "";
    if (currentSiren !== "") {
        currentCompany = await getCompanyDataBySiren(currentSiren);
    }

    return {
        "product" : productData,
        "recommandation" : productWithSameCat,
        "companySeller" : company,
        "currentCompany" : currentCompany,
        "localisation" : localisation
    };
}

async function getProductDataById(id) {
    try {
        const query = `SELECT * FROM listing WHERE id_item = ` + id;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données du produit :", error);
        throw error;
    }
}

async function getAllProductDataWithSameCategories(categorieId, id) {
    try {
        const query = `SELECT * FROM listing WHERE id_object_type = ` + categorieId + ` AND id_item != ` + id;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données des produit associes:", error);
        throw error;
    }
}

async function getCompanyDataBySiren(siren) {
    try {
        const query = `SELECT * FROM company WHERE siren = ` + siren;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'entreprise :", error);
        throw error;
    }
}

async function getLocalisationOfObject(idEmplacement) {
    try {
        console.log(idEmplacement)
        const firstQuery = `SELECT id_Container FROM emplacement WHERE id_emplacement = ` + idEmplacement;
        const result = await getResultOfQuery("vue_user", firstQuery);
        console.log(result[0].id_Container);

        const lastQuery = `SELECT * FROM container WHERE id_Container = ` + result[0].id_Container;
        return await getResultOfQuery("vue_user", lastQuery);
    } catch (error) {
        console.error("Erreur lors de la récupération des données de la localisation :", error);
        throw error;
    }
}

module.exports = { getDataForProductPageById };