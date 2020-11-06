const {
  handleCommonError,
  handleCommonResponse,
} = require("../helpers/responses");

/**
 * Creates a new user
 * @param {*} req
 * @param {*} res
 */
const createOne = async (req, res) => {
  try {
    handleCommonResponse(res, { user: "createOne success" });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  createOne,
};
