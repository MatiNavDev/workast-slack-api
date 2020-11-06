const request = require("supertest");

const { app, routeInitialText } = require("../index");

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
    await DBInstance.init();
    this.articles = DBInstance.db.collection("articles");
  });

  beforeEach(async () => {
    this.articles.deleteMany({});
  });

  describe("(POST) Create Article Tests Suite: /articles", () => {
    it("should create an Article successfully (200)", async () => {
      const {
        body: {
          data: { article: articleParam },
        },
      } = request(app).post(route).send(articleToSave).expect(200);

      const articlesFromDB = await this.articles.find({}).toArray();

      expect(articlesFromDB.length).toBe(1);
      expect(articlesFromDB[0]).toContain(articleParam);
    });

    it("should fail because no article sent", () => {
      const {
        body: { message },
      } = request(app).post(route).expect(500);

      expect(message).toBe(NO_ARTICLE_SENT);
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
      done();
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
      done();
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
      } = request(app).get(route).expect(200);

      expect(article.length).toBe(2);
      articlesToInsert.forEach((art) => {
        expect(
          articles.find(
            ({ userId: userIdFromDB }) => userIdFromDB === art.userId
          )
        ).toContain(art);
      });

      done();
    });
  });
});
