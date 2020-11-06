const Article = require("../db/classes/articles");
const {
  handleCommonError,
  handleCommonResponse,
} = require("../helpers/responses");
const {
  NO_ARTICLE_SENT,
  CREATE_ARTICLE_WRONG_PROPERTY,
} = require("../constansts/responsesMessages/article");

/**
 * Crates a new article
 * @param {*} req
 * @param {*} res
 */
const createOne = async ({ body: { article } }, res) => {
  try {
    if (!article)
      return handleCommonError(res, { message: NO_ARTICLE_SENT, status: 422 });

    const { userId, title, text, tags } = article;
    if (
      [userId, title, text].some((prop) => !prop) ||
      [userId, title, text].some((prop) => typeof prop !== "string") ||
      (tags && !Array.isArray(tags))
    )
      return handleCommonError(res, {
        message: CREATE_ARTICLE_WRONG_PROPERTY,
        status: 422,
      });

    const articleCreated = await Article.createOne({
      userId,
      title,
      text,
      tags,
    });
    handleCommonResponse(res, { article: articleCreated });
  } catch (error) {
    console.log(error);
    handleCommonError(res, error);
  }
};

/**
 * Edits an existing article
 * @param {*} req
 * @param {*} res
 */
const editOne = async ({ params: { id } }, res) => {
  try {
    handleCommonResponse(res, { article: `editOne success, id: ${id}` });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Deletes an existing article
 * @param {*} req
 * @param {*} res
 */
const deleteOne = async ({ params: { id } }, res) => {
  try {
    handleCommonResponse(res, { article: `deleteOne success, id: ${id}` });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Returns all articles
 * @param {*} req
 * @param {*} res
 */
const getAll = async (req, res) => {
  try {
    handleCommonResponse(res, { article: "getAll success" });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  createOne,
  editOne,
  deleteOne,
  getAll,
};
