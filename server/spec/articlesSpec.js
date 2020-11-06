const request = require("supertest");

const { Article } = require("../db/classes");
const { app, routeInitialText } = require("../index");
const {
  NO_ARTICLE_SENT,
  ARTICLE_WRONG_PROPERTY,
  ARTICLE_ID_NOT_FOUND,
} = require("../constansts/responsesMessages/article");

const route = `${routeInitialText}/articles`;
const randomId = "someRandomId";

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

const unexistingId = "5fa5cdad1a1e6962df2834d9";

describe("Articles Tets Suite", () => {
  beforeAll(async () => {
    await Article.init();
  });

  beforeEach(async () => {
    await Article.articles.deleteMany({});
  });

  afterAll(async () => {
    await Article.articles.deleteMany({});
  });

  describe("(POST) Create Article Tests Suite ", () => {
    it("should create an Article successfully (200)", async () => {
      const {
        body: {
          data: { article: articleParam },
        },
      } = await request(app)
        .post(route)
        .send({ article: articleToSave })
        .expect(200);

      const articlesFromDB = await Article.articles.find({}).toArray();

      expect(articlesFromDB.length).toBe(1);
      expect(articlesFromDB[0]._id.toString()).toBe(articleParam._id);
      expect(articlesFromDB[0]).toEqual(
        jasmine.objectContaining(articleToSave)
      );
    });

    it("should create an Article successfully without tags (200)", async () => {
      let articleToSaveWithouTag = { ...articleToSave };
      delete articleToSaveWithouTag.tags;

      const {
        body: {
          data: { article: articleParam },
        },
      } = await request(app)
        .post(route)
        .send({ article: articleToSaveWithouTag })
        .expect(200);

      const articlesFromDB = await Article.articles.find({}).toArray();

      expect(articlesFromDB.length).toBe(1);
      expect(articlesFromDB[0]._id.toString()).toBe(articleParam._id);
      expect(articlesFromDB[0]).toEqual(
        jasmine.objectContaining(articleToSaveWithouTag)
      );
    });

    it("should fail because no article sent (422)", async () => {
      const {
        body: { message },
      } = await request(app).post(route).expect(422);

      expect(message).toBe(NO_ARTICLE_SENT);
    });

    it("should fail because missing property (422)", async () => {
      const {
        body: { message },
      } = await request(app)
        .post(route)
        .send({ article: { title: "title", text: "text" } })
        .expect(422);

      expect(message).toBe(ARTICLE_WRONG_PROPERTY);
    });

    it("should fail because userId not valid (422)", async () => {
      const {
        body: { message },
      } = await request(app)
        .post(route)
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
      } = await request(app).put(`${route}/${randomId}`).expect(422);

      expect(message).toBe(NO_ARTICLE_SENT);
    });

    it("should fail because userId not valid (422)", async () => {
      const {
        body: { message },
      } = await request(app)
        .put(`${route}/5fa5cdad1a1e6962df2834d9`)
        .send({ article: { ...articleSaved, userId: 3 } })
        .expect(422);

      expect(message).toBe(ARTICLE_WRONG_PROPERTY);
    });

    it("should fail because article not found (404)", async () => {
      const {
        body: { message },
      } = await request(app)
        .put(`${route}/${unexistingId}`)
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
        .expect(200);

      const articlesFromDB = await Article.articles.find({}).toArray();
      expect(articleParam).toEqual(jasmine.objectContaining(articleSaved));
      expect(articlesFromDB.length).toBe(0);
    });

    it("should fail because article not found (404)", async () => {
      const {
        body: { message },
      } = await request(app).delete(`${route}/${unexistingId}`).expect(404);

      expect(message).toBe(ARTICLE_ID_NOT_FOUND);
    });
  });

  describe("(GET) Get all Articles Tests Suite", () => {
    it("should get all Articles successfully (200)", async () => {
      const articlesToInsert = [articleSaved, articleToSave];
      await Article.articles.insertMany(articlesToInsert);

      const {
        body: {
          data: { article: articles },
        },
      } = request(app).get(routeWithQueryParams).expect(200);

      expect(article.length).toBe(2);
      articlesToInsert.forEach((art) => {
        expect(
          articles.find(
            ({ userId: userIdFromDB }) => userIdFromDB === art.userId
          )
        ).toContain(art);
      });
    });

    it("should get one Article because tag 'new' (200)", async () => {
      const articlesToInsert = [articleSaved, articleToSave];
      await Article.articles.insertMany(articlesToInsert);
      const routeWithQueryParams = `${route}?tags=new`;

      const {
        body: {
          data: { article: articles },
        },
      } = request(app).get(routeWithQueryParams).expect(200);

      expect(article.length).toBe(1);
      expect(articles).toContain(articlesToInsert[0]);
    });

    it("should not get an article because tag 'no exists' (200)", async () => {
      const articlesToInsert = [articleSaved, articleToSave];
      await Article.articles.insertMany(articlesToInsert);
      const routeWithQueryParams = encodeURI(`${route}?tags=no exists`);

      const {
        body: {
          data: { article: articles },
        },
      } = request(app).get(routeWithQueryParams).expect(200);

      expect(articles.length).toBe(0);
    });
  });
});
