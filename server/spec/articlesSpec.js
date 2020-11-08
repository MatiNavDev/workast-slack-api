const request = require("supertest");
const using = require("jasmine-data-provider");
const mock = require("mock-require");

const { Article, User } = require("../db/classes");
const { app, routeInitialText } = require("../index");
const { getValidToken } = require("../helpers/token");
const { invalidTokenTest, noTokenTest } = require("./asserts/middleware");
const { slackTest } = require("./asserts/slack");
const { createOneSpy } = require("./mockers/slack");
const {
  NO_ARTICLE_SENT,
  ARTICLE_WRONG_PROPERTY,
  ARTICLE_ID_NOT_FOUND,
} = require("../constants/responsesMessages/article");

const route = `${routeInitialText}/articles`;
const randomId = "someRandomId";
const unexistingId = "5fa5cdad1a1e6962df2834d9";

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

const userToSave = {
  name: "name",
  avatar: "avatar",
};

describe("Articles Tets Suite", () => {
  beforeAll(async () => {
    await Promise.all([Article, User].map((Class) => Class.init()));
  });

  beforeEach(async () => {
    await Article.articles.deleteMany({});
  });

  afterAll(async () => {
    mock.stopAll();
    await Article.articles.deleteMany({});
  });

  describe("(POST) Create Article Tests Suite ", () => {
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
      console.log(process.env.NODE_ENV);
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

  describe("(PUT) Edit Article Tests Suite", () => {
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

  describe("(DELETE) Delete Article Tests Suite", () => {
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

  describe("(GET) Get all Articles Tests Suite", () => {
    beforeEach(async () => {
      this.articlesToInsertWithoutId = [articleSaved, articleToSave];
      await Article.articles.insertMany([
        { ...articleSaved },
        { ...articleToSave },
      ]);
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
          this.articlesToInsertWithoutId.find(({ tags }) =>
            tags.includes("new")
          )
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

  using(
    [
      {
        name: "Create One Article",
        method: "post",
        route,
      },
      {
        name: "Edit One Article",
        method: "put",
        route: `${route}/someId`,
      },
      {
        name: "Delete One Article",
        method: "delete",
        route: `${route}/someId`,
      },
      {
        name: "Get All Articles",
        method: "get",
        route,
      },
    ],
    (data) => {
      describe(`Authentication Test ${data.name}`, () => {
        it("should not validate successfully because no token (401)", async () => {
          await noTokenTest(data.method, data.route);
        });

        it("should not validate successfully because no token (401)", async () => {
          await invalidTokenTest(data.method, data.route);
        });
      });
    }
  );
});
