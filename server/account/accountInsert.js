const bcrypt = require("bcryptjs");
const { getResultOfQuery } = require("../db_utils/db_functions");

async function validateSiren(siren) {
    // Vérification que le SIREN fait 14 caractères
    if (siren.length !== 14) {
        return { valid: false, message: "Le SIREN doit comporter exactement 14 caractères." };
    }

    // Vérification si le SIREN existe déjà en base
    try {
        const query = "SELECT COUNT(*) as count FROM company WHERE SIREN = ?";
        const result = await getResultOfQuery("vue_user", query, [siren]);

        if (result[0].count > 0) {
            return { valid: false, message: "Un compte avec ce siren existe déjà." };
        }

        return { valid: true };
    } catch (error) {
        console.error("Erreur lors de la vérification du SIREN :", error);
        return { valid: false, message: "Erreur lors de la vérification du SIREN." };
    }
}

async function registerCompany(siren, nom, email, password, adress, zipcode, city, phone) {
    try {
        // Vérification du SIREN
        const sirenValidation = await validateSiren(siren);
        if (!sirenValidation.valid) {
            return { success: false, message: sirenValidation.message }; // Renvoi du message d'erreur
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Construction de la requête SQL d'insertion
        const query = "INSERT INTO company (SIREN, nom, email, password, adress, zipcode, city, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Exécution de la requête avec des paramètres pour éviter l'injection SQL
        const result = await getResultOfQuery("vue_user", query, [siren, nom, email, hashedPassword, adress, zipcode, city, phone]);

        return { success: true, message: "Utilisateur enregistré avec succès." };
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        return { success: false, message: "Erreur lors de l'enregistrement de l'utilisateur." };
    }
}

module.exports = { registerCompany };
