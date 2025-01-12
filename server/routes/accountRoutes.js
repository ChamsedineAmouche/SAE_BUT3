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
router.post('/forgotPassword', forgotPassword);
router.get('/verifyToken', verifyToken);
router.post('/resetPassword', resetPassword);
router.get('/inscription_validation', validationAccount)
router.post('/deleteInscription',deleteInscription)
router.post('/validateInscription',validateInscription)
router.get('/annuaire',annuaire)

module.exports = router;
