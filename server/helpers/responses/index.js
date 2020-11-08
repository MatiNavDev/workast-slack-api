const ResponseError = require("./ResponsesStrategy/ResponseError");
const ResponseSuccess = require("./ResponsesStrategy/ResponseSuccess");

/**
 * Handles an Error Response
 * @param {any} res
 * @param {any} error
 */
const handleCommonError = (res, error) => {
  const respError = new ResponseError(res, error, error.status);
  respError.sendResponse();
};

/**
 * Handles a Successfull Response
 * @param {any} res
 * @param {any} error
 */
const handleCommonResponse = (res, success, status) => {
  const respSuccess = new ResponseSuccess(res, success, status);
  respSuccess.sendResponse();
};

module.exports = {
  handleCommonError,
  handleCommonResponse,
};
