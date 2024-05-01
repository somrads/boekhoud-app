const express = require("express");
const router = express.Router();
const knexConfig = require("../db/db").knexConfig;
const knex = require("knex")(knexConfig);

router.get("/", async (req, res) => {
    try {
        const data = await knex.select('*').from('bseg');
        res.json(data);
    } catch (err) {
        res.status(500).send(`Error retrieving bseg records: ${err.message}`);
    }
});

router.get("/filter", async (req, res) => {
    try {
        const { bukrs, belnr, gjahr, buzei, bschl, augdt } = req.query;
        const data = await knex('bseg').where({ bukrs, belnr, gjahr, buzei, bschl, augdt });
        res.json(data);
    } catch (err) {
        res.status(500).send(`Error retrieving bseg records: ${err.message}`);
    }
});

router.post("/", async (req, res) => {
    try {
        const { bukrs, belnr, gjahr, buzei, buzid, augdt, augcp, augbl, bschl } = req.body;

        // Check for existing primary key in bkpf
        const found = await knex('bkpf').where({ bukrs, belnr, gjahr }).first();
        if (!found) {
            throw new Error('No corresponding entry in bkpf table with the given primary key.');
        }

        // Insert into bseg
        await knex('bseg').insert({ bukrs, belnr, gjahr, buzei, buzid, augdt, augcp, augbl, bschl });
        
        res.status(201).send('Record inserted into bseg successfully.');
    } catch (err) {
        res.status(500).send(`Error inserting into bseg: ${err.message}`);
    }
});

module.exports = router;
