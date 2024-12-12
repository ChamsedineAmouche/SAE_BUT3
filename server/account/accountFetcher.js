const { getResultOfQuery } = require("../db_utils/db_functions");


async function getAccountInscriptions() {
    try {
      const query = `SELECT * FROM company WHERE active = '0'`;
      const result = await getResultOfQuery("vue_user", query);
  
      if (result.length === 0) {
        console.log("Pas d'utilisateurs en attente d'inscriptions");
        return { success: True, message: "Pas d'inscriptions en cours", account : {} };
      }

        return { success: true, message: "", account : result};
    } catch (error) {
      return { success: false, message: "Erreur interne de vérification" };
    }
  }

  async function getAccountInfo(siren) {
    try {
      const query = `SELECT * FROM company WHERE siren = '${siren}'`;
      const result = await getResultOfQuery("vue_user", query);
  
      if (result.length === 0) {
        console.log("Pas d'utilisateurs");
        return { success: True, message: "Pas d'utilisateurs", account : {} };
      }
        return { success: true, message: "", account : result};
    } catch (error) {
      return { success: false, message: "Erreur interne de vérification" };
    }
  }
  
  module.exports = { getAccountInscriptions, getAccountInfo };
  