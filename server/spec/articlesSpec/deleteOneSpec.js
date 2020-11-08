const request = require("supertest");
const mock = require("mock-require");

const { Article } = require("../../db/classes");
const { app, routeInitialText } = require("../../index");
const { getValidToken } = require("../../helpers/token");
const {
  ARTICLE_ID_NOT_FOUND,
} = require("../../constants/responsesMessages/article");

const route = `${routeInitialText}/articles`;
const unexistingId = "5fa5cdad1a1e6962df2834d9";

const articleSaved = {
  userId: "userIdSaved",
  title: "titleSaved",
  text: "textSaved",
  tags: ["newSaved", "largeSaved", "tennisSaved"],
};

const validToken = getValidToken();

describe("(DELETE) Delete Article Tests Suite", () => {
  beforeAll(async () => {
    await Article.init();
  });

  beforeEach(async () => {
    await Article.articles.deleteMany({});
  });

  afterAll(async () => {
    mock.stopAll();
    await Article.articles.deleteMany({});
  });

  it("should delete an Article successfully (200)", async () => {
    const {
      ops: [articleSavedInDB],
    } = await Article.articles.insertOne({ ...articleSaved });

    const {
      body: {
        data: { article: articleParam },
      },
    } = await request(app)
      .delete(`${route}/${articleSavedInDB._id}`)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    const articlesFromDB = await Article.articles.find({}).toArray();
    expect(articleParam).toEqual(jasmine.objectContaining(articleSaved));
    expect(articlesFromDB.length).toBe(0);
  });

  it("should fail because article not found (404)", async () => {
    const {
      body: { message },
    } = await request(app)
      .delete(`${route}/${unexistingId}`)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(message).toBe(ARTICLE_ID_NOT_FOUND);
  });
});
