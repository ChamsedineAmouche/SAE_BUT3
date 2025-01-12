const { getDataForProductPageById, getCompanyDataBySiren, getProductData} = require('../pageproduct/pageProductFetcher')
const {reserveProductInDataBase} = require('../reserveProduct/productReserver')
const {sendMailForReservation, sendMailForReservationOurObject, sendMailForFavoritesObjects} = require("../nodemailer/mailer");
const {pickProductById} = require("../pickProduct/productPicker");
const {getResultOfQuery} = require("../db_utils/db_functions");
const {deleteObject} = require("../object/objectDelete")

const getSirenFromRequest = (req) => {
    const { siren } = req.query;
    if (siren) return { siren, source: "query" };
    if (req.session && req.session.user) return { siren: req.session.user.siren, source: "session" };
    throw new Error("No siren provided in query or session.");
};


const product = async (req, res) => {
    try {
        const { id } = req.query;
        let pageProductData;
        if (req.session.user) {
            pageProductData = await getDataForProductPageById(id, req.session.user.siren);
        }
        else {
            pageProductData = await getDataForProductPageById(id, "");
        }
        res.json(pageProductData);
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const reserveProduct = async (req, res) => {
    try {
        let siren = "";
        if (req.session && req.session.user && req.session.user.siren) {
            siren = req.session.user.siren;
        } else {
            throw new Error("Le SIREN est requis mais introuvable dans la query ou la session.");
        }

        const { idItem } = req.query;
        const productData = await getProductData(idItem);
        const status = productData.status;
        if (status === 'reserved' || status === 'picked') {
            res.status(500).json({ error: "L'objet est déjà réservé ou récupéré" });
        } else {
            await reserveProductInDataBase(idItem, siren)
            const companyData = await getCompanyDataBySiren(siren);
            const companyOfObject = await getCompanyDataBySiren(productData.siren);
            sendMailForReservation(companyData[0].email, productData.title, companyData[0].nom, idItem, status);
            sendMailForReservationOurObject(companyOfObject[0].email, productData.title, companyOfObject[0].nom, idItem, status);
            res.status(200).json({ message: 'Soumission reçue avec succès'});
        }
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};

const pickProduct = async (req, res) => {
    try {
        let siren = "";
        if (req.session && req.session.user && req.session.user.siren) {
            siren = req.session.user.siren;
        } else {
            throw new Error("Le SIREN est requis mais introuvable dans la query ou la session.");
        }

        const { idItem } = req.query;
        const productData = await getProductData(idItem);
        const status = productData.status;
        if (status === 'picked') {
            res.status(500).json({ error: "L'objet est déjà récupéré" });
        } else {
            if (status === 'waiting') {
                const companyData = await getCompanyDataBySiren(siren);
                const companyOfObject = await getCompanyDataBySiren(productData.siren);
                sendMailForReservation(companyData[0].email, productData.title, companyData[0].nom, idItem, status);
                sendMailForReservationOurObject(companyOfObject[0].email, productData.title, companyOfObject[0].nom, idItem, status);

                const query = `SELECT c.email FROM company c JOIN listing_favorites lf ON c.siren = lf.siren WHERE lf.id_item = ${idItem}`;
                const companyWhoLike = await getResultOfQuery('vue_user', query);
                for (const key in companyWhoLike[0]) {
                    const email = companyWhoLike[0][key]
                    sendMailForFavoritesObjects(email, productData.title, companyData[0].nom, idItem);
                }
            }
            await pickProductById(idItem, siren, status)
            res.status(200).json({ message: 'Soumission reçue avec succès'});
        }
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};

const deleteDepotUser = async (req, res) => {
    try{
        const { siren, source } = getSirenFromRequest(req);
        if (source === "session") {
        const {idItem} = req.query
        const result = await deleteObject(idItem);
        res.json(result)
    }
    else{
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Pas de session user en cours');
    }}
    catch(error){
        console.error("Erreur lors de la récupération des depots :", error);
        res.status(500).json('Erreur interne du serveur' );
    }
}

module.exports = { product, reserveProduct, pickProduct, deleteDepotUser };