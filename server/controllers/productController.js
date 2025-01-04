const { getDataForProductPageById } = require('../pageproduct/pageProductFetcher')

const product = async (req, res) => {
    try {
        const { id } = req.query;
        let pageProductData;
        if (req.session.user) {
            pageProductData = await getDataForProductPageById(id, req.session.user.siren);
        }
        else {
            pageProductData = await getDataForProductPageById(id, "");
        }
        res.json(pageProductData);
    } catch (error) {
        console.error('Erreur lors du traitement de la soumission :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};


module.exports = { product };