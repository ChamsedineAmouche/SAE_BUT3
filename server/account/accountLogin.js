const bcrypt = require("bcryptjs");
const { getResultOfQuery } = require("../db_utils/db_functions");

async function validateActive(email) {
  const query = `SELECT active FROM company WHERE email = '${email}'`;
    
  try {
    const result = await getResultOfQuery("vue_user", query);

    if (result[0].active == 0) {
      return { valid: false, message: "Votre compte n'est pas actif" };
    }

    return { valid: true };
  } catch (error) {
    console.error("Erreur lors de la validation du Mail :", error);
    return { valid: false, message: "Erreur lors de la validation du Mail." };
  }
}

async function verifyCredentials(email, password) {
  try {
    const query = `SELECT * FROM company WHERE email = '${email}'`;
    const result = await getResultOfQuery("vue_user", query);

    if (result.length === 0) {
      console.log("Utilisateur non trouvé");
      return { success: false, message: "Utilisateur non trouvé" };
    }

    const activeAccount = await validateActive(email)
    if (!activeAccount.valid){
      return { success: false, message: "Ce compte n'est pas actif" };
    }

    const user = result[0]; 
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Mot de passe incorrect");
      return { success: false, message: "Mot de passe incorrect" };
    }

    console.log("Connexion réussie");
    return { success: true, message: "Connexion réussie", siren : result[0].siren};
  } catch (error) {
    return { success: false, message: "Erreur interne de vérification" };
  }
}

async function verifyCredentialsAdmin(id, password) {
  try {
    const query = `SELECT * FROM admin WHERE admin_id = '${id}'`;
    const result = await getResultOfQuery("vue_admin", query);

    if (result.length === 0) {
      console.log("Admin non trouvé");
      return { success: false, message: "Utilisateur non trouvé" };
    }
    const admin = result[0]; 
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      console.log("Mot de passe incorrect");
      return { success: false, message: "Mot de passe incorrect" };
    }

    console.log("Connexion réussie");
    return { success: true, message: "Connexion réussie", admin : result[0].admin_id};
  } catch (error) {
    return { success: false, message: "Erreur interne de vérification" };
  }
}

module.exports = { verifyCredentials, verifyCredentialsAdmin };
