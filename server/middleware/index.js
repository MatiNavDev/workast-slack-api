const { getDataIfValidToken } = require("./helpers");
const { handleCommonError } = require("../helpers/responses");
const {
  INVALID_TOKEN,
  NO_TOKEN,
} = require("../constants/responsesMessages/middlewares");

/**
 * Validate Bearer Token
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function authMiddleware({ headers: { authorization } }, res, next) {
  try {
    const token = authorization;

    if (!token)
      return handleCommonError(res, { message: NO_TOKEN, status: 401 });

    const jwtToken = token.split(" ")[1];

    const data = getDataIfValidToken(jwtToken);
    if (!data)
      return handleCommonError(res, { message: INVALID_TOKEN, status: 401 });

    res.locals.tokenData = data.data;
    return next();
  } catch (error) {
    handleCommonError(res, error);
  }
}

module.exports = {
  authMiddleware,
};
