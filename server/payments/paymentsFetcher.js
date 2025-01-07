const crypto = require('crypto');
const { getResultOfQuery } = require('../db_utils/db_functions');

const ALGORITHM = 'aes-256-cbc';
// Clé de chiffrement (32 octets pour AES-256)

function decryptCardNumber(encryptedData, encryptionKey) {
    const [initializationVectorAsHex, encryptedDataAsHex] = encryptedData?.split(':');
    const initializationVector = Buffer.from(initializationVectorAsHex, 'hex');
    const hashedEncryptionKey = crypto.createHash('sha256').update(encryptionKey).digest('hex').substring(0, 32);
    const decipher = crypto.createDecipheriv('aes256', hashedEncryptionKey, initializationVector);
    
    let decryptedText = decipher.update(Buffer.from(encryptedDataAsHex, 'hex'));
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);
  
    return decryptedText.toString();
}

function maskCardNumber(cardNumber) {
    const visibleDigits = cardNumber.slice(-4);
    return '•'.repeat(12) + visibleDigits; // Utilisation de dots pour masquer
}

async function getCardDetailsBySiren(siren) {
    try {
        const query = `SELECT id, encrypted_card_number, encryption_key, expiration_date FROM payment_cards WHERE siren=${siren}`;
        console.log("Executing query:", query);
        const results = await getResultOfQuery("payment_data", query);

        if (!results || results.length === 0) {
            throw new Error("Aucune carte trouvée pour ce SIREN.");
        }

        const cards = results.map((row) => {
            const {id :id, encrypted_card_number: encryptedCard, encryption_key: encryptionKey, expiration_date: expiryDate } = row;
            const cardNumber = decryptCardNumber(encryptedCard, encryptionKey);
            const maskedCardNumber = maskCardNumber(cardNumber);

            return { id : id, cardNumber: maskedCardNumber, expiryDate: expiryDate };
        });
        return cards;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails des cartes :', error);
        throw new Error("Erreur lors de la récupération des détails des cartes.");
    }
}



module.exports = { getCardDetailsBySiren, decryptCardNumber };
