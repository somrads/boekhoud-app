/**
 * Run the migrations to create 'bkpf' and 'bseg' tables with foreign keys and comments.
 * 
 * @param { import("knex").Knex } knex - The Knex connection instance.
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema
        // Create the 'bkpf' table
        .createTable('bkpf', function (table) {
            table.string('bukrs', 4).notNullable();  // Using string with length limit
            table.string('belnr', 10).notNullable(); // Using string with length limit
            table.string('gjahr', 4).notNullable();  // Using string with length limit
            table.string('blart', 2);                // Using string with length limit
            table.date('bldat');
            table.date('budat');
            table.string('monat', 2);                // Using string with length limit
            table.date('cpudt');
            table.time('cputm');
            table.primary(['bukrs', 'belnr', 'gjahr']); // Composite primary key
            table.comment('Primary accounting table');
        });

        console.log("Table 'bkpf' created successfully.");

    // Comments on bkpf columns
    await knex.schema.raw("COMMENT ON COLUMN bkpf.bukrs IS 'Bedrijfsnummer'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.belnr IS 'Documentnummer boekhoudingsdocument'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.gjahr IS 'Boekjaar'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.blart IS 'Documentsoort'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.bldat IS 'Documentdatum in document'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.budat IS 'Boekingsdatum in document'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.monat IS 'Boekmaand'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.cpudt IS 'Dag waarop boekhoudingsdocument is ingevoerd'");
    await knex.schema.raw("COMMENT ON COLUMN bkpf.cputm IS 'Tijd waarop gegevens zijn ingevoerd'");

    // Create the 'bseg' table
    await knex.schema.createTable('bseg', function (table) {
        table.string('bukrs', 4).notNullable();
        table.string('belnr', 10).notNullable();
        table.string('gjahr', 4).notNullable();
        table.string('buzei', 3).notNullable();
        table.string('buzid', 1);
        table.date('augdt');
        table.date('augcp');
        table.string('augbl', 10);
        table.string('bschl', 2);
        table.primary(['bukrs', 'belnr', 'gjahr', 'buzei']); // Primary key
        table.foreign(['bukrs', 'belnr', 'gjahr']).references(['bukrs', 'belnr', 'gjahr']).inTable('bkpf'); // Correct composite foreign key
        table.comment('Secondary posting table referencing bkpf');
    });

    console.log("Table 'bseg' created successfully.");

    // Comments on bseg columns
    await knex.schema.raw("COMMENT ON COLUMN bseg.bukrs IS 'Bedrijfsnummer'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.belnr IS 'Documentnummer boekhoudingsdocument'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.gjahr IS 'Boekjaar'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.buzei IS 'Nummer van boekingsregel in boekhoudingsdocument'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.buzid IS 'Identificatie van boekingsregel'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.augdt IS 'Datum van vereffening'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.augcp IS 'Invoerdatum van de vereffening'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.augbl IS 'Documentnummer van vereffeningsdocument'");
    await knex.schema.raw("COMMENT ON COLUMN bseg.bschl IS 'Boekingssleutel'");
};

/**
 * Reverse the migrations, dropping the 'bseg' and 'bkpf' tables.
 * 
 * @param { import("knex").Knex } knex - The Knex connection instance.
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    try {
        await knex.schema.dropTableIfExists('bseg');
        await knex.schema.dropTableIfExists('bkpf');
        console.log("Tables dropped successfully");
    } catch (error) {
        console.error("Error dropping tables:", error);
        throw error; // Properly throw the error to handle it up the chain
    }
};
