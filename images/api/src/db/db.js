const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile"); 
const knexConfig = config[environment] || config.development; 
const knex = require("knex")(knexConfig);

module.exports = {
  knexConfig, // Export the chosen configuration

  /**
   * Connect to the PostgreSQL server.
   *
   * @returns {Promise} A promise that resolves when connection is successful.
   */
  connect: async () => {
    await knex
      .raw("SELECT 1+1 AS result");
    return console.log("Connected to PostgreSQL server");
  },

  /**
   * Execute a raw SQL query.
   *
   * @param {string} sql - The SQL query string.
   * @param {Array} params - Parameters to pass into the SQL query.
   * @returns {Promise} A promise that resolves with the query result.
   */
  query: (sql, params) => {
    return knex.raw(sql, params);
  },
};
