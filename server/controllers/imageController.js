const { getImageById } = require('../image/imageFetcher')

const image = async (req, res) => {
    const { id } = req.query; // Récupère l'ID depuis les paramètres de requête
    try {
        if (!id) {
            return res.status(400).json({ error: "ID non fourni" });
        }

        const rows = await getImageById(id); // Récupère l'image selon l'ID
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Image non trouvée" });
        }

        const images = rows.map((row) => ({
            data: Array.from(new Uint8Array(row.image)),
            mimeType: row.mime_type,
        }));

        res.json(images);
    } catch (error) {
        console.error("Erreur lors de la récupération des données pour /image :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des données." });
    }
};

module.exports = { image };