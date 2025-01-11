const {insertCardDetails } = require("../payments/paymenstInsert")
const {getCardDetailsBySiren, getDefaultCardBySiren } = require("../payments/paymentsFetcher")
const {deleteCardById} = require("../payments/paymentDelete")
const {updateCardByID} = require("../payments/paymentUpdate")
const getSirenFromRequest = (req) => {
    const { siren } = req.query;
    if (siren) return { siren, source: "query" };
    if (req.session && req.session.user) return { siren: req.session.user.siren, source: "session" };
    throw new Error("No siren provided in query or session.");
}; 

const insertCard = async (req, res) => {
    try {
        const {siren, source} = getSirenFromRequest(req)
        if (source === "session") {
            const { cardName, firstName, lastName, cardNumber, expirationDate, isDefault } = req.query
            console.log(cardName, firstName, lastName, cardNumber, expirationDate, isDefault)
            await insertCardDetails(siren, cardName, firstName, lastName, cardNumber, expirationDate, isDefault)
            res.status(200).json({ message: "Carte insérée avec succès." });
        }
        else {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne' });
    }
};

const getCards = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        if (source === "session") {
            const cards = await getCardDetailsBySiren(siren);
            res.status(200).json({ cards });
        } else {
            res.status(400).json({ error: 'Source invalide.' });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne.' });
    }
};

const getDefaultCard = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        if (source === "session") {
            const cards = await getDefaultCardBySiren(siren);
            res.status(200).json({ cards });
        } else {
            res.status(400).json({ error: 'Source invalide.' });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne.' });
    }
};


const deleteCard = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        if (source === "session") {
            const { cardId } = req.query;
            await deleteCardById(cardId, siren);
            res.status(200).json({ message: "Carte supprimé avec succès." });
        } else {
            res.status(400).json({ error: 'Source invalide.' });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne.' });
    }
};

const updateCard = async (req, res) => {
    try {
        const { siren, source } = getSirenFromRequest(req);

        if (source === "session") {
            const { cardId , cardName ,firstName, lastName, isDefault} = req.query;
            if (cardName && firstName && lastName){
            await updateCardByID(cardId, siren, cardName ,firstName, lastName);}
            if (isDefault){
                await updateCardDefaultById(siren,id)
            }
            res.status(200);
        } else {
            res.status(400).json({ error: 'Source invalide.' });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne.' });
    }
};

module.exports = { insertCard,getCards, deleteCard, updateCard, getDefaultCard };