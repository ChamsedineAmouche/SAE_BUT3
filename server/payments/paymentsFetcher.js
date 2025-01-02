const crypto = require('crypto');

async function decryptCardNumber(encryptedData, iv) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // Clé utilisée pour le chiffrement
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function getCardDetailsBySiren(siren) {
    try {
        const query = `SELECT encrypted_card_number, iv FROM payment_cards WHERE siren=${siren}`;
        const result =await getResultOfQuery("payment_data", query);
        const { encrypted_card_number, iv } = result.rows[0];

        // Déchiffrement
        const cardNumber = decryptCardNumber(encrypted_card_number, iv);
        return cardNumber;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des labels des types d'objet");
    }
}

module.exports = { getCardDetailsBySiren };
