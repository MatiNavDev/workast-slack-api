const jwt = require("jsonwebtoken");

const {
  jwt: { secret: jwtSecret },
} = require("../../../config/config.test");

/**
 * returns a valid jwt token
 */
const getValidToken = () =>
  jwt.sign(
    {
      data: "you are a valid user :)",
    },
    jwtSecret,
    { expiresIn: "1h" }
  );

/**
 * returns an invalid jwt token
 */
function getInvalidToken() {
  const validToken = getValidToken();
  return validToken.slice(3, validToken.length) + "abcd";
}

module.exports = {
  getInvalidToken,
  getValidToken,
};
