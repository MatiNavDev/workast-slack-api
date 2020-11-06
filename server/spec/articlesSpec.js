const request = require("supertest");

const { Article } = require("../db/classes");
const { app, routeInitialText } = require("../index");
const {
  NO_ARTICLE_SENT,
  CREATE_ARTICLE_WRONG_PROPERTY,
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

      expect(message).toBe(CREATE_ARTICLE_WRONG_PROPERTY);
    });

    it("should fail because userId not valid (422)", async () => {
      const {
        body: { message },
      } = await request(app)
        .post(route)
        .send({ article: { userId: 3, title: "title", text: "text" } })
        .expect(422);

      expect(message).toBe(CREATE_ARTICLE_WRONG_PROPERTY);
    });
  });

  describe("(PUT) Edit Article Tests Suite", () => {
    it("should edit an Article successfully (200)", async () => {
      await this.articles.insertOne(articleSaved);

      const {
        body: {
          data: { article: articleParam },
        },
      } = request(app)
        .put(`${route}/${randomId}`)
        .send(articleToSave)
        .expect(200);

      const articlesFromDB = await this.articles.find({}).toArray();

      expect(articlesFromDB.length).toBe(1);
      expect(articlesFromDB[0]).toContain(articleParam);
    });
  });

  describe("(DELETE) Delete Article Tests Suite", () => {
    it("should delete a Article successfully (200)", async () => {
      await this.articles.insertOne(articleSaved);

      const {
        body: {
          data: { article },
        },
      } = request(app).delete(`${route}/${randomId}`).expect(200);

      const articlesFromDB = await this.articles.find({}).toArray();

      expect(article.includes(randomId)).toBe(true);
      expect(articlesFromDB.length).toBe(0);
    });
  });

  describe("(GET) Get all Articles Tests Suite", () => {
    it("should get all Articles successfully (200)", async () => {
      const articlesToInsert = [articleSaved, articleToSave];
      await this.articles.insertMany(articlesToInsert);

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
      await this.articles.insertMany(articlesToInsert);
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
      await this.articles.insertMany(articlesToInsert);
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
