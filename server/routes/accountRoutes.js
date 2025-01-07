const express = require('express');
const router = express.Router();
const {
    register,
    loginUser,
    loginAdmin,
    getSession,
    destroySession,
    forgotPassword,
    verifyToken,
    resetPassword,
    validationAccount,
    deleteInscription, 
    validateInscription,
    annuaire
} = require('../controllers/accountController');

router.post('/inscription', register);
router.post('/connexion', loginUser);
router.post('/connexion_admin', loginAdmin);
router.get('/getSession', getSession);
router.get('/destroySession', destroySession);
router.post('/oubli_mot_de_passe', forgotPassword);
router.get('/verifyToken', verifyToken);
router.post('/reinitialisation_mot_de_passe', resetPassword);
router.get('/inscription_validation', validationAccount)
router.post('/deleteInscription',deleteInscription)
router.post('/validateInscription',validateInscription)
router.get('/annuaire',annuaire)

module.exports = router;
