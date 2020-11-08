const request = require("supertest");

const { Article } = require("../../db/classes");
const { app, routeInitialText } = require("../../index");
const { getValidToken } = require("../../helpers/token");
const {
  NO_ARTICLE_SENT,
  ARTICLE_WRONG_PROPERTY,
  ARTICLE_ID_NOT_FOUND,
} = require("../../constants/responsesMessages/article");

const route = `${routeInitialText}/articles`;
const randomId = "someRandomId";
const unexistingId = "5fa5cdad1a1e6962df2834d9";

const articleSaved = {
  userId: "userIdSaved",
  title: "titleSaved",
  text: "textSaved",
  tags: ["newSaved", "largeSaved", "tennisSaved"],
};

const validToken = getValidToken();

describe("(PUT) Edit Article Tests Suite", () => {
  beforeAll(async () => {
    await Article.init();
  });

  beforeEach(async () => {
    await Article.articles.deleteMany({});
  });

  it("should edit an Article successfully (200)", async () => {
    const articleChangedTitle = "articleChanged";
    const {
      ops: [articleSavedInDB],
    } = await Article.articles.insertOne({ ...articleSaved });

    const {
      body: {
        data: { article: articleParam },
      },
    } = await request(app)
      .put(`${route}/${articleSavedInDB._id}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: { ...articleSaved, title: articleChangedTitle } })
      .expect(200);

    const articlesFromDB = await Article.articles
      .find({ _id: articleSavedInDB._id })
      .toArray();

    expect(articlesFromDB.length).toBe(1);
    expect(articlesFromDB[0].title).toBe(articleChangedTitle);
    expect(articleParam.title).toBe(articleChangedTitle);
  });

  it("should fail because no article sent (422)", async () => {
    const {
      body: { message },
    } = await request(app)
      .put(`${route}/${randomId}`)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(422);

    expect(message).toBe(NO_ARTICLE_SENT);
  });

  it("should fail because userId not valid (422)", async () => {
    const {
      body: { message },
    } = await request(app)
      .put(`${route}/5fa5cdad1a1e6962df2834d9`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: { ...articleSaved, userId: 3 } })
      .expect(422);

    expect(message).toBe(ARTICLE_WRONG_PROPERTY);
  });

  it("should fail because article not found (404)", async () => {
    const {
      body: { message },
    } = await request(app)
      .put(`${route}/${unexistingId}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: articleSaved })
      .expect(404);

    expect(message).toBe(ARTICLE_ID_NOT_FOUND);
  });
});
