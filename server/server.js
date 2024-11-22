const express = require('express')
const app = express()
const { fetchData, fetchData2 } = require('./read/homepageFetcher');

app.get('/', (req, res) => {
    console.log("Endpoint '/' was called");
    res.send('Hello, World!');
});

app.get("/api", (req, res) => {
    console.log("Endpoint '/api' was called");
    const data =fetchData()
    res.json(data);
})

app.get("/api1", (req, res) => {
    console.log("Endpoint '/api1' was called");
    const data1 = fetchData2()
    res.json(data1)
})

app.listen(5000, () =>{console.log("Server started on port 5000")})