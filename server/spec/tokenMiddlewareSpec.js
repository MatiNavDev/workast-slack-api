const { Article } = require("../db/classes");
const { routeInitialText } = require("../index");
const {
  invalidTokenTest,
  noTokenTest,
  successAuthTest,
} = require("./asserts/middleware");

const route = `${routeInitialText}/articles`;

describe("Token Middleware Test Suite", () => {
  beforeAll(async () => {
    await Article.init();
  });

  afterAll(async () => {
    await Article.articles.deleteMany({});
  });

  it("should validate successfully because valid token", async () => {
    await successAuthTest("get", route);
  });

  it("should not validate successfully because not valid token (401)", async () => {
    await invalidTokenTest("get", route);
  });

  it("should not validate successfully because no token (401)", async () => {
    await noTokenTest("get", route);
  });
});
