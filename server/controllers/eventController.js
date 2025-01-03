const { getDataForEventPage } = require('../event/eventPageFetcher')

const getEventPageData = async (req, res) => {
    try {
        const { id } = req.query;
        const eventPageData = await getDataForEventPage(id);

        res.json(eventPageData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
};

module.exports = { getEventPageData }