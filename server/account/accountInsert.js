const bcrypt = require("bcryptjs");
const { getResultOfQuery } = require("../db_utils/db_functions");
const crypto = require('crypto');

async function validateSiren(siren) {
    if (siren.length !== 14) {
        return { valid: false, message: "Le SIREN doit comporter exactement 14 caractères." };
    }

    const query = `SELECT COUNT(*) as count FROM company WHERE SIREN = '${siren}'`;
    
    try {
        const result = await getResultOfQuery("vue_user", query);

        if (result[0].count > 0) {
            return { valid: false, message: "Un compte avec ce siren existe déjà." };
        }

        return { valid: true };
    } catch (error) {
        console.error("Erreur lors de la validation du SIREN :", error);
        return { valid: false, message: "Erreur lors de la validation du SIREN." };
    }
}

async function validateMail(email) {

    const query = `SELECT COUNT(*) as count FROM company WHERE email = '${email}'`;
    
    try {
        const result = await getResultOfQuery("vue_user", query);

        if (result[0].count > 0) {
            return { valid: false, message: "Un compte avec ce mail existe déjà." };
        }

        return { valid: true };
    } catch (error) {
        console.error("Erreur lors de la validation du mail :", error);
        return { valid: false, message: "Erreur lors de la validation du mail." };
    }
}

async function validatePassword(password) {
    if (password.length < 10) {
        return { valid: false, message: "Le mot de passe doit comporter au moins 10 caractères." };
    }

    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /\d/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (!upperCasePattern.test(password)) {
        return { valid: false, message: "Le mot de passe doit contenir au moins une majuscule." };
    }

    if (!lowerCasePattern.test(password)) {
        return { valid: false, message: "Le mot de passe doit contenir au moins une minuscule." };
    }

    if (!numberPattern.test(password)) {
        return { valid: false, message: "Le mot de passe doit contenir au moins un chiffre." };
    }

    if (!specialCharPattern.test(password)) {
        return { valid: false, message: "Le mot de passe doit contenir au moins un caractère spécial." };
    }

    return { valid: true };
}



async function registerCompany(siren, nom, email, password,confirmPassword, adress, zipcode, city, phone) {
    try {
        const sirenValidation = await validateSiren(siren);
        if (!sirenValidation.valid) {
            return { success: false, message: sirenValidation.message };
        }

        const emailValidation = await validateMail(email);
        if (!emailValidation.valid) {
            return { success: false, message: emailValidation.message };
        }

        if (!(password == confirmPassword)){
            return { success: false, message: "Les mots de passes ne correspondent pas" };
        }

        const passwordValidation = await validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.message };
        }   

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(64).toString('hex');

        const query = `INSERT INTO company (siren, nom, email, password, adress, zipcode, city, phone, token) VALUES ('${siren}', '${nom}', '${email}', '${hashedPassword}', '${adress}','${zipcode}', '${city}', '${phone}', '${token}')`;
        const result = await getResultOfQuery("vue_user", query);

        const queryPref = `INSERT INTO preference (preference, notif, info, siren) VALUES ('{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true}','{"event": true, "forum": true, "meuble": true, "article": true, "message": true, "elearning": true}','{"info_pp": true, "info_city": true, "info_email": true, "info_phone": true, "info_adress": true, "info_zipcode": true}', '${siren}')`;
        const resultPref = await getResultOfQuery("vue_user", queryPref);

        return { success: true, message: "Votre compte a été créé avec succès, un mail de confirmation vous sera envoyé quand un admin aura accepté votre demande." };
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        return { success: false, message: "Erreur lors de l'enregistrement de l'utilisateur." };
    }
}

async function validateCompany(siren) {
    try {
        const query = `UPDATE company SET active = '1'  WHERE siren = '${siren}'`;
        const result = await getResultOfQuery("vue_user", query);
        if (result.length === 0) {
            console.log("Company validé !");
            return { success: True, message: "Pas d'inscriptions en cours", account : {} };
        }
        return { success: true, message: "Company validé", account : result};
    } catch (error) {
        return { success: false, message: "Erreur interne de vérification" };
    }
}

module.exports = { registerCompany,validateCompany, validatePassword };
