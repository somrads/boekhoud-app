const express = require("express");
const router = express.Router();
const knexConfig = require("../db/db").knexConfig;
const knex = require("knex")(knexConfig);

// Get route for fetching data from 'bkpf' table
router.get("/", async (request, response) => {
    try {
        const bkpf = await knex.select().from("bkpf");
        response.json(bkpf);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.get("/filter", async (req, res) => {
    try {
        const { bukrs, belnr, gjahr, blart, bldat} = req.query;
        const data = await knex('bseg').where({ bukrs, belnr, gjahr, blart, bldat});
        res.json(data);
    } catch (err) {
        res.status(500).send(`Error retrieving bseg records: ${err.message}`);
    }
});

// Post route for inserting data into 'bkpf' table
router.post("/", async (request, response) => {
    // Extract data from request body
    const { bukrs, belnr, gjahr, blart, bldat, budat, monat, cpudt, cputm } = request.body;

    // Basic validation
    if (!bukrs || !belnr || !gjahr || !blart || !bldat || !budat || !monat || !cpudt || !cputm) {
        return response.status(400).json({ error: "All fields are required" });
    }

    try {
        // Insert data into the database
        await knex('bkpf').insert({
            bukrs,
            belnr,
            gjahr,
            blart,
            bldat,
            budat,
            monat,
            cpudt,
            cputm
        });

        // Respond with success message
        response.status(201).json({ message: "Record added successfully" });
    } catch (error) {
        // Handle errors and send error response
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;
