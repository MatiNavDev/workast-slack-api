const DBInstance = require("./dbInstance");

class Articles {
  async init() {
    this.articles = await DBInstance.getCollection("article");
  }

  /**
   * Create a single article
   * @param {any} article
   */
  async createOne(article) {
    const {
      ops: [articleCreated],
    } = await this.articles.insertOne(article);

    return articleCreated;
  }
}

module.exports = new Articles();
