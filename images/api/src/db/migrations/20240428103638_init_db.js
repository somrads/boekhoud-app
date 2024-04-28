const fs = require('fs');
const path = require('path');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    let sql = fs.readFileSync(path.join(__dirname, '../sql/initialize_tables.sql'), 'utf8');
    return knex.raw(sql);
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('bseg')
    .dropTableIfExists('bkpf');
  
};
