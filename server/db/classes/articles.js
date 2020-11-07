const DBInstance = require("./dbInstance");

class Articles {
  async init() {
    this.articles = await DBInstance.getCollection("articles");
  }

  /**
   * Creates a single article
   * @param {any} article
   */
  async createOne(article) {
    const {
      ops: [articleCreated],
    } = await this.articles.insertOne(article);

    return articleCreated;
  }

  /**
   * Edits a single article
   * @param {any} article
   */
  async editOne({ id, userId, title, text, tags }) {
    const { value: articleEdited } = await this.articles.findOneAndUpdate(
      { _id: id },
      { $set: { userId, title, text, tags } },
      { returnOriginal: false }
    );

    return articleEdited;
  }

  /**
   * Deletes an article with id sent
   * @param {any} param
   */
  async deleteOne({ id }) {
    const { value: articleDeleted } = await this.articles.findOneAndDelete({
      _id: id,
    });
    return articleDeleted;
  }

  /**
   * Get all articles with specific tags. If any sent, returns all articles
   * @param {*} tags
   */
  getAll(tags) {
    const query = tags.length ? { tags: { $in: tags } } : {};
    return this.articles.find(query).toArray();
  }
}

module.exports = new Articles();
