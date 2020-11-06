const DBInstance = require("./dbInstance");

class Users {
  async init() {
    this.users = await DBInstance.getCollection("users");
  }

  /**
   * Create a single user
   * @param {any} user
   */
  async createOne(user) {
    const {
      ops: [userCreated],
    } = await this.users.insertOne(user);

    return userCreated;
  }
}

module.exports = new Users();
