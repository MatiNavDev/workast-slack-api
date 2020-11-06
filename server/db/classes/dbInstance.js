require("dotenv").config();

const { promisify } = require("util");
const { MongoClient } = require("mongodb");

const {
  mongo: { url, database },
} = require(`../../../config/config.${process.env.NODE_ENV}`);

MongoClient.connect = promisify(MongoClient.connect);

class DBInstance {
  /**
   * connects to DB
   */
  async init() {
    if (!this.db) {
      const client = await new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).connect();
      this.db = client.db(database);
    }
  }

  async getCollection() {
    await this.init();
    return this.db.collection("users");
  }
}

module.exports = new DBInstance();
