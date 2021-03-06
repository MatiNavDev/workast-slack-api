require("dotenv").config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mongo: {
    url: process.env.DB_URL_SPEC,
    database: process.env.DB_DATABASE_SPEC,
  },
};
