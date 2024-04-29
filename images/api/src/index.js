const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path"); 
const bodyParser = require("body-parser")
const cors = require("cors")
const knexConfig = require("./db/db").knexConfig;
const knex = require("knex")(knexConfig);
const db = require("./db/db"); 


db.connect();

app.use(bodyParser.json());

app.get("/boekhouding", (req, res) => {
    knex.select('*').from('bseg')
        .then(data => res.json(data))
        .catch(err => res.status(500).send(`Error retrieving bseg records: ${err.message}`));
});

app.get("/boekhouding/filter", (req, res) => {
    knex('bseg')
        .where({
            bukrs: req.query.bukrs,
            belnr: req.query.belnr,
            gjahr: req.query.gjahr
        })
        .then(data => res.json(data))
        .catch(err => res.status(500).send(`Error retrieving bseg records: ${err.message}`));
});

app.post("/boekhouding", (req, res) => {
    // Assuming req.body contains the entire row data for bseg table
    const { bukrs, belnr, gjahr, buzei, buzid, augdt, augcp, augbl, bschl } = req.body;

    // Check for existing primary key in bkpf
    knex('bkpf')
        .where({ bukrs, belnr, gjahr })
        .first()
        .then(found => {
            if (!found) {
                return res.status(400).send('No corresponding entry in bkpf table with the given primary key.');
            }

            // If found, insert into bseg
            return knex('bseg').insert({
                bukrs, belnr, gjahr, buzei, buzid, augdt, augcp, augbl, bschl
            });
        })
        .then(() => res.status(201).send('Record inserted into bseg successfully.'))
        .catch(err => res.status(500).send(`Error inserting into bseg: ${err.message}`));
});



app.get("/table-comments/financiele-boekhouding", async (req, res) => {
    try {
        const comments = await knex.raw(`
            SELECT
                cols.column_name,
                pg_catalog.col_description(c.oid, cols.ordinal_position::int) AS column_comment
            FROM
                pg_catalog.pg_class c
                JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                JOIN information_schema.columns cols ON cols.table_schema = n.nspname AND cols.table_name = c.relname
            WHERE
                c.relname = 'bkpf' AND c.relkind = 'r' AND n.nspname = 'public'  -- 'public' is the default schema
        `);
        res.json(comments.rows);
    } catch (error) {
        res.status(500).send(`Error fetching table comments: ${error.message}`);
    }
});


app.get("/financiele-boekhouding", (request, response) => {
    knex
        .select()
        .from("bkpf")
        .then(bkpf => response.json(bkpf))
        .catch(err => response.status(500).json({ error: err.message }));
});

app.post("/financiele-boekhouding", (request, response) => {
    // Extract data from request body
    const { bukrs, belnr, gjahr, blart, bldat, budat, monat, cpudt, cputm } = request.body;

    // Insert data into the database
    knex('bkpf')
        .insert({
            bukrs: bukrs,
            belnr: belnr,
            gjahr: gjahr,
            blart: blart,
            bldat: bldat,
            budat: budat,
            monat: monat,
            cpudt: cpudt,
            cputm: cputm
        })
        .then(() => {
            response.status(201).json({ message: "Record added successfully" });
        })
        .catch(err => {
            response.status(500).json({ error: err.message });
        });
});




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

