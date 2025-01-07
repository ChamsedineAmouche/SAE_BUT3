const mysql = require('mysql2');
const {getResultOfQuery} = require("../db_utils/db_functions");

async function getDataForProductPageById(id, currentSiren) {
    console.log('ici' + currentSiren)
    const productData = await getProductDataById(id);
    const productWithSameCat = await getAllProductDataWithSameCategories(productData[0].id_object_type, id);
    const company = await getCompanyDataBySiren(productData[0].siren);
    let currentCompany = "";
    if (currentSiren !== "") {
        currentCompany = await getCompanyDataBySiren(currentSiren);
    }

    return {
        "product" : productData,
        "recommandation" : productWithSameCat,
        "companySeller" : company,
        "currentCompany" : currentCompany
    };
}

async function getProductDataById(id) {
    try {
        console.log(id);
        const query = `
            SELECT l.*, 
                   ct.label AS state, 
                   ot.label AS category,
                   c.adress, 
                   c.city, 
                   c.zipcode,
                   COALESCE(lf.count, 0) AS nbLikes
            FROM listing l
            LEFT JOIN (
                SELECT id_item, COUNT(*) AS count
                FROM listing_favorites
                GROUP BY id_item
            ) lf ON l.id_item = lf.id_item
            JOIN condition_type ct ON l.id_condition_type = ct.id_condition_type
            JOIN object_type ot ON l.id_object_type = ot.id_object_type
            JOIN emplacement e ON l.id_emplacement = e.id_emplacement
            JOIN container c ON e.id_Container = c.id_Container
            WHERE l.id_item = ` + id;
        return await getResultOfQuery("vue_user", query);
    } catch (error) {
        console.error("Erreur lors de la récupération des données du produit :", error);
        throw error;
    }
}

async function getAllProductDataWithSameCategories(categorieId, id) {
    try {
        const query = `SELECT l.*, COALESCE(lf.count, 0) AS nbLikes
        FROM listing l
        LEFT JOIN (
            SELECT id_item, COUNT(*) AS count
            FROM listing_favorites
            GROUP BY id_item
        ) lf ON l.id_item = lf.id_item
           WHERE id_object_type = '${categorieId}' AND l.id_item != ` + id;
        const productsData = await getResultOfQuery("vue_user", query);
        const formattedProducts = await Promise.all(
            productsData.map(async (product) => {
                const {
                    id_item,
                    id_object_type : idObjectType,
                    id_condition_type : idConditionType,
                    title,
                    status,
                    nbLikes
                } = product;
                const state = await getConditionByID(idConditionType);
                const category = await getCategoryByID(idObjectType);
                return {
                    id_item,
                    title,
                    status,
                    state,
                    category,
                    nbLikes
                };
            })
        );
        return formattedProducts;
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

async function getCategoryByID(idCategory) {
    try {
        const query = `SELECT label FROM object_type WHERE id_object_type = ${idCategory}`;
        const result = await getResultOfQuery("vue_user", query);
        return result.length > 0 ? result[0].label : "Unknown Category";
    } catch (error) {
        console.error("Error fetching category:", error);
        return "Unknown Category";
    }
}

async function getConditionByID(idCondition) {
    try {
        const query = `SELECT label FROM condition_type WHERE id_condition_type = ${idCondition}`;
        const result = await getResultOfQuery("vue_user", query);
        return result.length > 0 ? result[0].label : "Unknown Condition";
    } catch (error) {
        console.error("Error fetching condition:", error);
        return "Unknown Condition";
    }
}

async function getProductData(id) {
    try {
        const query = `SELECT * FROM listing WHERE id_item = ${id}`
        const productData = await getResultOfQuery('vue_user', query);
        const {
            id_item,
            id_object_type: idObjectType,
            id_condition_type: idConditionType,
            title,
            description,
            dimension,
            date_posted: datePosted,
            status,
            id_emplacement: idEmplacement,
            siren } = productData[0];
        const condition = await getConditionByID(idConditionType);
        const category = await getCategoryByID(idObjectType);
        return {
            id_item,
            title,
            description,
            dimension,
            date: datePosted,
            status,
            siren,
            condition,
            category,
            idEmplacement
        };
    } catch (error) {
        console.error(error);
    }
}

//Renvoie tout les depots et ses infos a partir d'un statut et d'un siren
async function getListingBySirenAndStatus(siren, status){
    try{
        const query = `SELECT id_item FROM listing WHERE siren = ${siren} and status = '${status}'`;
        console.log(query)
        const listingItems = await getResultOfQuery('vue_user', query)
        console.log(listingItems)
        const depots = await Promise.all(
            listingItems.map(async (depot) => {
                const productData = await getProductData(depot.id_item);
                return { ...productData };
            })
        );

        return {depots}

    }
    catch (error){
        console.error(error)
    }
}

module.exports = { getDataForProductPageById, getProductData, getListingBySirenAndStatus, getCompanyDataBySiren };