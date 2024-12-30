const { getResultOfQuery } = require("../db_utils/db_functions");
const { validatePassword } = require("./accountInsert");
const bcrypt = require("bcryptjs");


async function updatePassword(siren, password,confirmPassword) {

    if (!(password == confirmPassword)){
        return { success: false, message: "Les mots de passes ne correspondent pas" };
    }

    const passwordValidation = await validatePassword(password);
    if (!passwordValidation.valid) {
        return { success: false, message: passwordValidation.message };
    }   

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `UPDATE company SET password ='${hashedPassword}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre mot de passe a été modifié avec succès, un mail de confirmation vous sera envoyé." };

}

async function updateUsername(siren, name){
    try{
        if (name.length > 50) {
            return { success: false, message: "Votre nom ne peut pas dépasser 50 caractères" };
        }
    const query = `UPDATE company SET nom ='${name}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre nom a été modifié avec succès, un mail de confirmation vous sera envoyé." };
    }
    catch (error) {
        console.error('Error updating name :', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function updateMail(siren, email){
    try{
        if (email.length > 75) {
            return { success: false, message: "Votre email ne peut pas dépasser 75 caractères" };
        }
    const query = `UPDATE company SET email ='${email}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre email a été modifié avec succès, un mail de confirmation vous sera envoyé." };
    }
    catch (error) {
        console.error('Error updating name :', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function updateAdress(siren, adress){
    try{
        if (adress.length > 255) {
            return { success: false, message: "Votre adresse ne peut pas dépasser 255 caractères" };
        }
    const query = `UPDATE company SET adress ='${adress}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre adresse a été modifié avec succès, un mail de confirmation vous sera envoyé." };
    }
    catch (error) {
        console.error('Error updating name :', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function updateZipcode(siren, zipcode){
    try{
        if (zipcode.length > 5) {
            return { success: false, message: "Votre code postal ne peut pas dépasser 5 caractères" };
        }
    const query = `UPDATE company SET zipcode ='${zipcode}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre addresse a été modifié avec succès, un mail de confirmation vous sera envoyé." };
    }
    catch (error) {
        console.error('Error updating name :', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function updateCity(siren, city){
    try{
        if (city.length > 50) {
            return { success: false, message: "Votre ville ne peut pas dépasser 50 caractères" };
        }
    const query = `UPDATE company SET city ='${city}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre ville a été modifié avec succès, un mail de confirmation vous sera envoyé." };
    }
    catch (error) {
        console.error('Error updating name :', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function updatePhone(siren, phone){
    try{
        if (phone.length > 50) {
            return { success: false, message: "Votre numéro de téléphone ne peut pas dépasser 10 caractères" };
        }
    const query = `UPDATE company SET phone ='${phone}'  WHERE siren = '${siren}'`;
    const result = await getResultOfQuery("vue_user", query);
    return { success: true, message: "Votre numéro de téléphone a été modifié avec succès, un mail de confirmation vous sera envoyé." };
    }
    catch (error) {
        console.error('Error updating name :', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}

module.exports = { updatePassword, updateUsername, updateMail, updateAdress, updateCity, updatePhone, updateZipcode};
