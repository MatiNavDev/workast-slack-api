const request = require("supertest");
const mock = require("mock-require");

const { Article, User } = require("../../db/classes");
const { app, routeInitialText } = require("../../index");
const { getValidToken } = require("../../helpers/token");
const { slackTest } = require("../asserts/slack");
const { createOneSpy } = require("../mockers/slack");
const {
  NO_ARTICLE_SENT,
  ARTICLE_WRONG_PROPERTY,
} = require("../../constants/responsesMessages/article");

const route = `${routeInitialText}/articles`;

const articleToSave = {
  userId: "userId",
  title: "title",
  text: "text",
  tags: ["new", "large", "tennis"],
};

const validToken = getValidToken();

const userToSave = {
  name: "name",
  avatar: "avatar",
};

describe("(POST) Create Article Tests Suite ", () => {
  beforeEach(async () => {
    await Article.articles.deleteMany({});
  });

  afterAll(async () => {
    mock.stopAll();
    await Article.articles.deleteMany({});
  });

  beforeAll(async () => {
    await Promise.all([Article, User].map((Class) => Class.init()));
    this.userSaved = await User.createOne(userToSave);
    this.articleToSaveWithRealUserId = {
      ...articleToSave,
      userId: this.userSaved._id,
    };
  });

  beforeEach(async () => {
    await Article.articles.deleteMany({});
  });

  afterAll(async () => {
    createOneSpy.calls.reset();
    await Promise.all(
      [Article.articles, User.users].map((col) => col.deleteMany({}))
    );
  });

  it("should create an Article successfully (200)", async () => {
    const {
      body: {
        data: { article: articleParam },
      },
    } = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: this.articleToSaveWithRealUserId })
      .expect(200);

    const articlesFromDB = await Article.articles.find({}).toArray();

    expect(articlesFromDB.length).toBe(1);
    expect(articlesFromDB[0]._id.toString()).toBe(articleParam._id);

    slackTest(createOneSpy, this.userSaved, this.articleToSaveWithRealUserId);
  });

  it("should create an Article successfully without tags (200)", async () => {
    let articleToSaveWithouTag = { ...this.articleToSaveWithRealUserId };
    delete articleToSaveWithouTag.tags;

    const {
      body: {
        data: { article: articleParam },
      },
    } = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: articleToSaveWithouTag })
      .expect(200);

    const articlesFromDB = await Article.articles.find({}).toArray();
    const { title, text, tags } = articlesFromDB[0];
    const { title: titleNotTag, text: textNotTag } = articleToSaveWithouTag;

    expect(articlesFromDB.length).toBe(1);
    expect(articlesFromDB[0]._id.toString()).toBe(articleParam._id);
    expect({ title, text, tags }).toEqual(
      jasmine.objectContaining({ title: titleNotTag, text: textNotTag })
    );
    expect(tags).toBe(null);
    slackTest(createOneSpy, this.userSaved, articleToSaveWithouTag);
  });

  it("should fail because no article sent (422)", async () => {
    const {
      body: { message },
    } = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(422);

    expect(message).toBe(NO_ARTICLE_SENT);
  });

  it("should fail because missing property (422)", async () => {
    const {
      body: { message },
    } = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: { title: "title", text: "text" } })
      .expect(422);

    expect(message).toBe(ARTICLE_WRONG_PROPERTY);
  });

  it("should fail because userId not valid (422)", async () => {
    const {
      body: { message },
    } = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ article: { userId: 3, title: "title", text: "text" } })
      .expect(422);

    expect(message).toBe(ARTICLE_WRONG_PROPERTY);
  });
});
