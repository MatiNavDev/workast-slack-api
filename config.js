require('dotenv').config()

module.exports = {
  mongo: {
    url: process.env.DB_URL,
    database: process.env.DB_DATABASE
  }
}