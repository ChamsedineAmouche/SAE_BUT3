const express = require('express')
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');
const cors = require('cors');
const app = express()
const RateLimit = require('express-rate-limit');

const homePageRoutes = require('./routes/homePageRoutes'); 
const accountRoutes = require('./routes/accountRoutes');
const insertAnnounceRoutes = require('./routes/insertAnnounceRoutes')
const imageRoutes  = require('./routes/imageRoutes')
const catalogRoutes = require('./routes/catalogRoutes')
const productRoutes = require('./routes/productRoutes')

const limiter = RateLimit({windowMs: 15 * 60 * 1000,  max: 100,});
app.use('/verifyToken', limiter);
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true                 
}));
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),  // Clé secrète pour signer l'ID de session, 
    resave: false,                // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: true,      // Sauvegarder une session si elle est nouvelle mais n'a pas été modifiée
    cookie: { secure: false }
}));

app.use(accountRoutes);
app.use(homePageRoutes);
app.use(insertAnnounceRoutes);
app.use(imageRoutes);
app.use(catalogRoutes)
app.use(productRoutes)


const server = app.listen(5001, () => {
    console.log("Server started on port 5001");
});

module.exports = { app, server };