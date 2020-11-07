const request = require("supertest");

const {
  INVALID_TOKEN,
  NO_TOKEN,
} = require("../../constants/responsesMessages/middlewares");
const { getInvalidToken, getValidToken } = require("../../helpers/token");
const { app } = require("../../index");

const validToken = getValidToken();
const invalidToken = getInvalidToken();

/**
 * Validates no token restriction
 * @param {string} method
 * @param {string} route
 */
async function noTokenTest(method, route) {
  const {
    body: { message },
  } = await request(app)[method](route).expect(401);

  expect(message).toBe(NO_TOKEN);
}

/**
 * Validates invalid token restriction
 * @param {string} method
 * @param {string} route
 */
async function invalidTokenTest(method, route) {
  const {
    body: { message },
  } = await request(app)
    [method](route)
    .set("Authorization", `Bearer ${invalidToken}`)
    .expect(401);

  expect(message).toBe(INVALID_TOKEN);
}

/**
 * Validates a successfully authentication
 * @param {string} method
 * @param {string} route
 */
async function successAuthTest(method, route) {
  await request(app)
    [method](route)
    .set("Authorization", `Bearer ${validToken}`)
    .expect(200);
}

module.exports = {
  noTokenTest,
  invalidTokenTest,
  successAuthTest,
};
