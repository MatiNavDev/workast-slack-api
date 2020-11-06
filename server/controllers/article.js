const {
  handleCommonError,
  handleCommonResponse,
} = require("../helpers/responses");

/**
 * Crates a new article
 * @param {*} req
 * @param {*} res
 */
const createOne = async (req, res) => {
  try {
    handleCommonResponse(res, { article: "createOne success" });
  } catch (error) {
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
