const crypto = require('crypto');
const {getResultOfQuery} = require('../db_utils/db_functions');

async function encryptCardNumber(cardNumber) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // Clé de chiffrement
    const iv = crypto.randomBytes(16);  // Vecteur d'initialisation
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}


async function insertCardDetails(siren, cardDetails) {
    try {
        const { cardName, firstName, lastName, cardNumber, expirationDate, isDefault } = cardDetails;
        const { encryptedData, iv } = encryptCardNumber(cardNumber);
        const query = ` INSERT INTO payment_cards (card_name, card_holder_first_name, card_holder_last_name, encrypted_card_number, expiration_date, siren, is_default, iv) 
        VALUES ('${cardName}', '${firstName}', , '${lastName}', '${encryptedData}', '${expirationDate}', '${siren}', '${isDefault}', '${iv}' )`;
        const result = await getResultOfQuery("payment_data", query);

    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

module.exports = { insertCardDetails };
