require("dotenv").config();

const { promisify } = require("util");
const { MongoClient } = require("mongodb");

const {
  mongo: { url, database },
} = require(`../../config/config.${process.env.NODE_ENV}`);

MongoClient.connect = promisify(MongoClient.connect);

class DBInstance {
  async init() {
    const client = await new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).connect();
    this.db = this.db ? this.db : client.db(database);
  }
}

module.exports = new DBInstance();
