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

async function getAllSiren(){
    try {
        const query = `SELECT siren FROM company`;
        const result = await getResultOfQuery("vue_user", query);
  
        if (result.length === 0) {
            console.log("Pas d'utilisateurs");
            return { success: True, message: "Pas d'utilisateurs", siren : {} };
        }
        return { success: true, message: "", siren : result};
    } catch (error) {
        return { success: false, message: "Erreur interne de vérification" };
    }
}

async function getNumberOfGivenObjects(siren) {
    try {
        const query = `SELECT COUNT(*) AS numberGiven FROM listing WHERE siren = '${siren}' AND status = 'picked'`;
        const result = await getResultOfQuery("vue_user", query);

        if (result.length === 0) {
            console.log("Pas d'objets trouvés");
            return 0;
        }
        return result[0].numberGiven;
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}


async function getNumberOfTakenObjects(siren){
    try {
        const query = `SELECT COUNT(*) AS numberTaken FROM transaction WHERE siren = '${siren}' AND status = 'picked'`;
        const result = await getResultOfQuery("vue_user", query);

        if (result.length === 0) {
            console.log("Pas d'objets trouvés");
            return 0;
        }
        return result[0].numberTaken ;
    } catch (error) {
        console.error(error);
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

async function getAnnuaireInfo() {
    try {
        const sirenResult = await getAllSiren();
        if (!sirenResult.success || sirenResult.siren.length === 0) {
            return { success: false, message: "Aucun siren trouvé", data: {} };}
        const annuaireData = await Promise.all(sirenResult.siren.map(async (company) => {
            const siren = company.siren;
            const numberGiven = await getNumberOfGivenObjects(siren)
            const numberTaken = await getNumberOfTakenObjects(siren)
            const accountInfo = await getAccountInfo(siren);
            console.log(accountInfo);
            if (accountInfo.success && accountInfo.account.length > 0) {
                const account = accountInfo.account[0];
                return { [siren]: { 
                    name: account.nom,
                    mail: account.email, 
                    adhésion : new Date(account.joined).toISOString().split('T')[0],
                    numberGiven : numberGiven,
                    numberTaken : numberTaken
                }
                };
            } else {return {};}}));
        const result = Object.assign({}, ...annuaireData);
        return { success: true, message: "", annuaire: result };
    } catch (error) {
        return { success: false, message: "Erreur interne lors de la récupération des informations de l'annuaire" };
    }
}

module.exports = { getAccountInscriptions, getAccountInfo, getAnnuaireInfo };
  