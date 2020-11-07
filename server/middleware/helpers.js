const jwt = require("jsonwebtoken");

const {
  jwt: { secret },
} = require(`../../config/config.${process.env.NODE_ENV}`);

/**
 * Check token and if it is valid returns data
 * @param {*} token
 */
function getDataIfValidToken(token) {
  try {
    jwt.verify(token, secret);
    return jwt.decode(token, secret);
  } catch (error) {}
}

module.exports = {
  getDataIfValidToken,
};
