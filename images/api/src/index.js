const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./db/db"); 

db.connect();


app.get("/", (request, response) => {
    response.send({message: "Hello World"})
})

app.listen(PORT, (err) => {
    if(!err){
        console.log("running on port " + PORT);
    } else {
        console.error(err)
    }
})

