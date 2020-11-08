const { Article, User } = require("../db/classes/");
const {
  handleCommonError,
  handleCommonResponse,
} = require("../helpers/responses");
const {
  NO_ARTICLE_SENT,
  ARTICLE_WRONG_PROPERTY,
  ARTICLE_ID_NOT_FOUND,
} = require("../constants/responsesMessages/article");
const { getObjectId } = require("../db/helpers/index");
const Slack = require("../integrations/slack");

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

    const newArticlePromise = Article.createOne({
      userId,
      title,
      text,
      tags,
    });

    const getUserNamePromise = User.getUserById(getObjectId(userId), {
      projection: {
        _id: 0,
        name: 1,
      },
    });

    const [articleCreated, { name }] = await Promise.all([
      newArticlePromise,
      getUserNamePromise,
    ]);

    await Slack.sendMessageToGeneralChannel(
      `${name} has a new post: ${text}. Check it out!!`
    );

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
    const articleDeleted = await Article.deleteOne({
      id: getObjectId(id),
    });

    if (!articleDeleted)
      return handleCommonError(res, {
        message: ARTICLE_ID_NOT_FOUND,
        status: 404,
      });

    handleCommonResponse(res, { article: articleDeleted });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Returns all articles
 * @param {*} req
 * @param {*} res
 */
const getAll = async ({ query: { tags } }, res) => {
  try {
    const tagsArray = tags ? tags.split(",") : [];
    const articles = await Article.getAll(tagsArray);

    handleCommonResponse(res, { article: articles });
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
