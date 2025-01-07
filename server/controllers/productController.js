const { getDataForProductPageById, getCompanyDataBySiren, getProductData} = require('../pageproduct/pageProductFetcher')
const {reserveProductInDataBase} = require('../reserveProduct/productReserver')
const {sendMailForReservation, sendMailForReservationOurObject} = require("../nodemailer/mailer");

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
        const siren = req.query.siren;

        const { idItem } = req.query;
        await reserveProductInDataBase(idItem, siren)
        const companyData = await getCompanyDataBySiren(siren);
        const productData = await getProductData(idItem);
        const companyOfObject = await getCompanyDataBySiren(productData[0].siren);
        sendMailForReservation(companyData[0].email, productData[0].title, companyData[0].nom, idItem);
        sendMailForReservationOurObject(companyOfObject[0].email, productData[0].title, companyOfObject[0].nom, idItem);
        res.status(200).json({ message: 'Soumission reçue avec succès'});
    } catch (error) {
        console.error("Erreur lors du traitement des paramètres :", error);
        res.status(500).json({ error: error.message || "Erreur interne du serveur" });
    }
};


module.exports = { product, reserveProduct };