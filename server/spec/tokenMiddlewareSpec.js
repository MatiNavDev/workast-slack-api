const request = require("supertest");
const jwt = require("jsonwebtoken");

const {
  NO_TOKEN,
  INVALID_TOKEN,
} = require("../constansts/responsesMessages/middlewares");

const { app, routeInitialText } = require("../index");
const {
  jwt: { secret: jwtSecret },
} = require("../../config/config.test");

const route = `${routeInitialText}/articles`;

const validToken = jwt.sign(
  {
    data: "you are a valid user :)",
  },
  jwtSecret,
  { expiresIn: "1h" }
);
const invalidToken = validToken.slice(3, validToken.length) + "abcd";

describe("Token Middleware Test Suite", () => {
  it("should validate successfully because valid token", async () => {
    await request(app)
      .get(route)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);
  });

  it("should not validate successfully because not valid token (401)", async () => {
    const {
      body: { message },
    } = await request(app)
      .get(route)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);

    expect(message).toBe(INVALID_TOKEN);
  });

  it("should not validate successfully because no token (401)", () => {
    const {
      body: { message },
    } = await request(app)
      .get(route)
      .expect(401);

    expect(message).toBe(NO_TOKEN);
  });
});
