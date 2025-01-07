const crypto = require('crypto');
const { getSafeResultOfQuery } = require('../db_utils/db_functions');

function generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  function encryptCardNumber(cardNumber) {
    const encryptionKey = generateEncryptionKey();  
    const initializationVector = crypto.randomBytes(16);
    const hashedEncryptionKey = crypto.createHash('sha256').update(encryptionKey).digest('hex').substring(0, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', hashedEncryptionKey, initializationVector);
    let encryptedData = cipher.update(Buffer.from(cardNumber, 'utf-8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    const result = `${initializationVector.toString('hex')}:${encryptedData.toString('hex')}`;
    return { encryptedData: result, encryptionKey };
  }

  async function insertCardDetails(siren, cardName, firstName, lastName, cardNumber, expirationDate, isDefault) {
    try {
        const { encryptedData, encryptionKey } = encryptCardNumber(cardNumber);
        const query = `
            INSERT INTO payment_cards 
            (card_name, card_holder_first_name, card_holder_last_name, encrypted_card_number, expiration_date, siren, is_default, encryption_key) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [cardName, firstName, lastName, encryptedData, expirationDate, siren, isDefault, encryptionKey];

        console.log("Query:", query);
        console.log("Params:", params);

        const result = await getSafeResultOfQuery("payment_data", query, params);
        return result;
    } catch (error) {
        console.error("Erreur dans insertCardDetails:", error.message);
        throw new Error("Échec de l'insertion dans la base de données.");
    }
}


module.exports = { insertCardDetails, encryptCardNumber };
