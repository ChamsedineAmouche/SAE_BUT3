const express = require('express');
const router = express.Router();
const {
    profile, 
    profileFavorite,
    profileListing,
    profileTransactions, 
    profilePurchases, 
    profileParameters,
    updateProfile
} = require('../controllers/profileController');

router.get('/profile',profile)
router.get('/profileFavorite',profileFavorite)
router.get('/profileListing',profileListing)
router.get('/profileTransactions',profileTransactions)
router.get('/profilePurchases',profilePurchases)
router.get('/profileParameters',profileParameters)
router.get('/updateProfile', updateProfile)

module.exports = router;