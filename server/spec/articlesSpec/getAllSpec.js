const request = require("supertest");
const mock = require("mock-require");

const { Article } = require("../../db/classes");
const { app, routeInitialText } = require("../../index");
const { getValidToken } = require("../../helpers/token");

const route = `${routeInitialText}/articles`;

const articleToSave = {
  userId: "userId",
  title: "title",
  text: "text",
  tags: ["new", "large", "tennis"],
};
const articleSaved = {
  userId: "userIdSaved",
  title: "titleSaved",
  text: "textSaved",
  tags: ["newSaved", "largeSaved", "tennisSaved"],
};

const validToken = getValidToken();

describe("(GET) Get all Articles Tests Suite", () => {
  beforeAll(async () => {
    await Article.init();
    this.articlesToInsertWithoutId = [articleSaved, articleToSave];

    await Article.articles.insertMany([
      { ...articleSaved },
      { ...articleToSave },
    ]);
  });

  afterAll(async () => {
    mock.stopAll();
    await Article.articles.deleteMany({});
  });

  it("should get all Articles successfully (200)", async () => {
    const {
      body: {
        data: { article: articlesParam },
      },
    } = await request(app)
      .get(route)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(articlesParam.length).toBe(2);
    this.articlesToInsertWithoutId.forEach((art) => {
      expect(
        articlesParam.find(
          ({ userId: userIdFromDB }) => userIdFromDB === art.userId
        )
      ).toEqual(jasmine.objectContaining(art));
    });
  });

  it("should get one Article because tag 'new' (200)", async () => {
    const routeWithQueryParams = encodeURI(`${route}?tags=new`);

    const {
      body: {
        data: { article: articlesParam },
      },
    } = await request(app)
      .get(routeWithQueryParams)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(articlesParam.length).toBe(1);
    expect(articlesParam).toContain(
      jasmine.objectContaining(
        this.articlesToInsertWithoutId.find(({ tags }) => tags.includes("new"))
      )
    );
  });

  it("should not get an article because tag 'no exists' (200)", async () => {
    const articlesToInsert = [{ ...articleSaved }, { ...articleToSave }];
    await Article.articles.insertMany(articlesToInsert);
    const routeWithQueryParams = encodeURI(`${route}?tags=no exists`);

    const {
      body: {
        data: { article: articles },
      },
    } = await request(app)
      .get(routeWithQueryParams)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(articles.length).toBe(0);
  });
});
