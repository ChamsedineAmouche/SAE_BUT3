const { getResultOfQuery } = require("../db_utils/db_functions");
const { getProductData} = require('../pageproduct/pageProductFetcher')


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

async function getAccountInfoByMail(email) {
    try {
        const query = `SELECT * FROM company WHERE email = '${email}'`;
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

async function verifyTokenSiren(token, siren) {
    try {
        const query = `SELECT token FROM company WHERE siren = '${siren}'`;
        const result = await getResultOfQuery("vue_user", query);

        if (result.length === 0) {
            console.log("Pas d'utilisateur trouvé avec ce SIREN.");
            return { success: false, message: "Pas d'utilisateur trouvé avec ce SIREN." };
        }

        const storedToken = result[0].token;
        if (storedToken === token) {
            return { success: true, message: "Token valide." };
        } else {
            return { success: false, message: "Token invalide." };
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return { success: false, message: "Erreur interne de vérification." };
    }
}


async function getAccountFavorites(siren) {
    try {
        const queryElearning = `SELECT * FROM elearning WHERE favorite = '1' and siren = '${siren}'`;
        const elearningFav = await getResultOfQuery("vue_user", queryElearning);

        const queryDepot = `SELECT id_item FROM listing_favorites WHERE siren = '${siren}'`;
        const depotFav = await getResultOfQuery("vue_user", queryDepot);

        const depots = await Promise.all(
            depotFav.map(async (depot) => {
                const productData = await getProductData(depot.id_item);
                return { ...depot, productData };
            })
        );

        return { success: true, elearning: elearningFav, depots };
    } catch (error) {
        console.error('Error fetching account favorites:', error);
        return { success: false, message: "Erreur interne de vérification" };
    }
}


async function getAccountPreferences(siren) {
    try {
        const query = `SELECT * FROM preference WHERE siren = '${siren}'`;
        return await getResultOfQuery("vue_user", query);
  
    } catch (error) {
        return { success: false, message: "Erreur interne de vérification" };
    }
}
module.exports = { getAccountInscriptions, getAccountInfo, getAnnuaireInfo, getAccountInfoByMail, verifyTokenSiren,getAccountFavorites, getAccountPreferences };
  