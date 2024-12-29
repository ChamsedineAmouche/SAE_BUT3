const { getElearningCategory, getElearningByCategory, getElearningBySiren } = require('../elearning/elearningFetcher');

const elearningList = async (req, res) => {
    try {
        const category = await getElearningCategory();
        const elearningByCat = await getElearningByCategory();        
        let elearningCompany = {}; // Valeur par défaut
        if (req.session && req.session.user) {
            elearningCompany = await getElearningBySiren(req.session.user.siren);
        }

        const eLearningData = {
            categories: category,
            eLearnings: elearningByCat,
            myElearnings: elearningCompany
        };
        
        res.json(eLearningData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { elearningList };
