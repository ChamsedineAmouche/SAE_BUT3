const express = require('express')
const mysql = require('mysql2');
const app = express()
const { fetchData, fetchData2 } = require('./read/homepageFetcher');

app.get('/', (req, res) => {
    console.log("Endpoint '/' was called");


});

app.get("/api", async (req, res) => {
    console.log("Endpoint '/api' was called");
    try {
        const data = await fetchData(); // Attendez que la promesse soit résolue
        res.json(data); // Envoyez les résultats en JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour /api :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données.' });
    }
})

app.get("/api1", (req, res) => {
    console.log("Endpoint '/api1' was called");
    const data1 = fetchData2()
    res.json(data1)
})

app.listen(5000, () =>{console.log("Server started on port 5000")})