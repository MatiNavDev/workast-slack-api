require("dotenv").config();

module.exports = {
  mongo: {
    url: process.env.DB_URL_SPEC,
    database: process.env.DB_DATABASE_SPEC,
  },
};
