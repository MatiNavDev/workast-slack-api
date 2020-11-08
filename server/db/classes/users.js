const DBInstance = require("./dbInstance");

class Users {
  /**
   * Init users collectiom
   */
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
  /**
   * Get a user looking for specific id
   * @param {any} user
   */
  async getUserById(id, options = {}) {
    const userCreated = await this.users.findOne({ _id: id }, options);
    return userCreated;
  }
}

module.exports = new Users();
