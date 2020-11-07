require("dotenv").config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mongo: {
    url: process.env.DB_URL,
    database: process.env.DB_DATABASE,
  },
};
