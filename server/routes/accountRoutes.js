const express = require('express');
const router = express.Router();
const {
    register,
    loginUser,
    loginAdmin,
    getSession,
    destroySession,
    forgotPassword,
    verifyTokenHandler,
    resetPassword,
    validationAccount,
    deleteInscription, 
    validateInscription,
    annuaire
} = require('../controllers/accountController');

router.post('/register', register);
router.post('/login', loginUser);
router.post('/loginAdmin', loginAdmin);
router.get('/getSession', getSession);
router.get('/destroySession', destroySession);
router.post('/forgotPassword', forgotPassword);
router.get('/verifyToken', verifyTokenHandler);
router.post('/resetPassword', resetPassword);
router.get('/validationAccount', validationAccount)
router.post('/deleteInscription',deleteInscription)
router.post('/validateInscription',validateInscription)
router.get('/annuaire',annuaire)

module.exports = router;
