const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const loadRoutes = require('./utils/loadRoutes'); 

const app = express();
const PORT = 5001;
const SESSION_SECRET = crypto.randomBytes(64).toString('hex');

// Middleware global
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                // Limite de 100 requêtes par fenêtre de temps
});

app.use('/verifyToken', limiter);
app.use(express.json({ limit: '100mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

loadRoutes(app, './routes');

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = { app, server };