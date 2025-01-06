const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé' });
    }
    try {
        const decoded = jwt.verify(token, 'mdp');
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
}




module.exports = { verifyToken };
