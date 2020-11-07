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

  async deleteOne({ id }) {
    const { value: articleDeleted } = await this.articles.findOneAndDelete({
      _id: id,
    });
    return articleDeleted;
  }

  getAll(tags) {
    const query = tags.length ? { tags: { $in: tags } } : {};
    return this.articles.find(query).toArray();
  }
}

module.exports = new Articles();
