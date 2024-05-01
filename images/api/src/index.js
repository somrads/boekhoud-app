const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors")
const db = require("./db/db"); 
const boekhoudingRouter = require("./routes/boekHoudingsRoutes")
const financieleBoekhoudingRouter = require("./routes/financieleBoekhoudingsRoutes")
const tableCommentsRouter = require("./routes/tableComments")

// Database Connection
db.connect();

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/boekhouding", boekhoudingRouter);
app.use("/financiele-boekhouding", financieleBoekhoudingRouter);
app.use("/table-comments", tableCommentsRouter);

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

