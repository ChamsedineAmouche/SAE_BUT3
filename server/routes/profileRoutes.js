const express = require('express');
const router = express.Router();
const {
    profile, 
    profileFavorite,
    profileListing,
    profileTransactions, 
    profilePurchases, 
    profileParameters,
    updateProfile,
    updateProfileNotif,
    updateProfileInfo,
    profileTransactionSource
} = require('../controllers/profileController');

router.get('/profile',profile)
router.get('/profileFavorite',profileFavorite)
router.get('/profileListing',profileListing)
router.get('/profileTransactions',profileTransactions)
router.get('/profilePurchases',profilePurchases)
router.get('/profileParameters',profileParameters)
router.get('/updateProfile', updateProfile)
router.get('/updateProfileNotif', updateProfileNotif)
router.get('/updateProfileInfo', updateProfileInfo)
router.get('/profileTransactionSource', profileTransactionSource)

module.exports = router;