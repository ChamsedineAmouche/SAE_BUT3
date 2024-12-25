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


module.exports = { updatePassword};
