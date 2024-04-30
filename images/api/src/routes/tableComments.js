const express = require("express");
const router = express.Router();
const knexConfig = require("../db/db").knexConfig;
const knex = require("knex")(knexConfig);

// Function to fetch table comments
async function fetchTableComments(tableName, res) {
    const comments = await knex.raw(`
        SELECT
            cols.column_name,
            pg_catalog.col_description(c.oid, cols.ordinal_position::int) AS column_comment
        FROM
            pg_catalog.pg_class c
            JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
            JOIN information_schema.columns cols ON cols.table_schema = n.nspname AND cols.table_name = c.relname
        WHERE
            c.relname = '${tableName}' AND c.relkind = 'r' AND n.nspname = 'public'
    `);
    if (comments.rows.length === 0) {
        return res.status(404).send(`No comments found for the '${tableName}' table.`);
    }
    res.json(comments.rows);
}

// Route to fetch comments for 'bkpf' table
router.get("/financiele-boekhouding", async (req, res) => {
    try {
        await fetchTableComments('bkpf', res);
    } catch (error) {
        console.error(`Error fetching table comments: ${error.message}`);
        res.status(500).send(`Error fetching table comments: ${error.message}`);
    }
});

// Route to fetch comments for 'bseg' table
router.get("/boekhouding", async (req, res) => {
    try {
        await fetchTableComments('bseg', res);
    } catch (error) {
        console.error(`Error fetching table comments: ${error.message}`);
        res.status(500).send(`Error fetching table comments: ${error.message}`);
    }
});

module.exports = router;
