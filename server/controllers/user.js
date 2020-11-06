const User = require("../db/classes/users");
const {
  handleCommonError,
  handleCommonResponse,
} = require("../helpers/responses");
const {
  NO_USER_SENT,
  CREATE_USER_WRONG_PROPERTY,
} = require("../constansts/responseMessages");

/**
 * Creates a new user
 * @param {*} req
 * @param {*} res
 */
const createOne = async ({ body: { user } }, res) => {
  try {
    if (!user)
      return handleCommonError(res, { message: NO_USER_SENT, status: 422 });

    const { name, avatar } = user;
    if ([name, avatar].some((prop) => typeof prop !== "string"))
      return handleCommonError(res, {
        message: CREATE_USER_WRONG_PROPERTY,
        status: 422,
      });

    const userCreated = await User.createOne({ name, avatar });
    handleCommonResponse(res, { user: userCreated });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  createOne,
};
