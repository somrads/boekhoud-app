module.exports = {
    development: {
      client: "pg",
      connection: process.env.POSTGRES_CONNECTION_STRING,
      pool: {
        min: 0, 
        max: 7, 
      },
      migrations: {
        directory: './migrations'
      },
    },
  };
  