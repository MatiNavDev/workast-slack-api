const Article = require("../db/classes/articles");
const {
  handleCommonError,
  handleCommonResponse,
} = require("../helpers/responses");
const {
  NO_ARTICLE_SENT,
  ARTICLE_WRONG_PROPERTY,
  ARTICLE_ID_NOT_FOUND,
} = require("../constansts/responsesMessages/article");
const { getObjectId } = require("../db/helpers/index");

const checkArticleParam = (article) => {
  if (!article) return NO_ARTICLE_SENT;

  const { userId, title, text, tags } = article;

  if (
    [userId, title, text].some((prop) => !prop) ||
    [userId, title, text].some((prop) => typeof prop !== "string") ||
    (tags && !Array.isArray(tags))
  )
    return ARTICLE_WRONG_PROPERTY;
};

/**
 * Crates a new article
 * @param {*} req
 * @param {*} res
 */
const createOne = async ({ body: { article } }, res) => {
  try {
    const errorMessage = checkArticleParam(article);
    if (errorMessage)
      return handleCommonError(res, { message: errorMessage, status: 422 });

    const { userId, title, text, tags } = article;

    const articleCreated = await Article.createOne({
      userId,
      title,
      text,
      tags,
    });

    handleCommonResponse(res, { article: articleCreated });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Edits an existing article
 * @param {*} req
 * @param {*} res
 */
const editOne = async ({ params: { id }, body: { article } }, res) => {
  try {
    const errorMessage = checkArticleParam(article);
    if (errorMessage)
      return handleCommonError(res, { message: errorMessage, status: 422 });

    const { userId, title, text, tags } = article;

    const articleEdited = await Article.editOne({
      id: getObjectId(id),
      userId,
      title,
      text,
      tags,
    });

    if (!articleEdited)
      return handleCommonError(res, {
        message: ARTICLE_ID_NOT_FOUND,
        status: 404,
      });

    handleCommonResponse(res, { article: articleEdited });
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
