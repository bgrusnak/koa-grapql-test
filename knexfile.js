require("dotenv").config();
const path = require("path");

const databaseFolder = path.join(__dirname, "database");

const base = {
  client: "postgresql",
  debug: false,
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.join(databaseFolder, "migrations")
  },
  seeds: {
    directory: path.join(databaseFolder, "seeds")
  }
};

const config = {
  development: {
    ...base,
    debug: process.env.KNEX_DEBUG === "true"
  },
  staging: {
    ...base,
    connection: `${process.env.DATABASE_URL}?ssl=true`
  },
  production: {
    ...base,
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    pool: { min: 2, max: 30 }
  }
};

module.exports = config;
