const { promisify } = require('util')
const { mongo: { url, database }} = require('../../config')
const { MongoClient } = require('mongodb')
MongoClient.connect = promisify(MongoClient.connect)

class DBInstance {
  async init () {
    const client = await new MongoClient(url, { useNewUrlParser: true }).connect()
    this.db = client.db(database)
  }
}


module.exports = new DBInstance()
