const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({"test" : ["test1", "test2"]})
})

app.listen(5000, () =>{console.log("Server started on port 5000")})