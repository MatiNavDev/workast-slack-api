const request = require("supertest");

const { app, routeInitialText } = require("../index");

const route = `${routeInitialText}/articles`;
const randomId = "someRandomId";

describe("Articles Tets Suite", () => {
  describe("(POST) Create Article Tests Suite: /articles", () => {
    it("should create a Article successfully (200)", (done) => {
      request(app)
        .post(route)
        .expect(200)
        .end(function (
          err,
          {
            body: {
              data: { article },
            },
          }
        ) {
          if (err) done(err);

          expect(article).toBeDefined();
          done();
        });
    });
  });

  describe("(PUT) Edit Article Tests Suite", () => {
    it("should edit a Article successfully (200)", (done) => {
      request(app)
        .put(`${route}/${randomId}`)
        .expect(200)
        .end(function (
          err,
          {
            body: {
              data: { article },
            },
          }
        ) {
          if (err) done(err);

          expect(article.includes(randomId)).toBe(true);
          done();
        });
    });
  });

  describe("(DELETE) Delete Article Tests Suite", () => {
    it("should delete a Article successfully (200)", (done) => {
      request(app)
        .delete(`${route}/${randomId}`)
        .expect(200)
        .end(function (
          err,
          {
            body: {
              data: { article },
            },
          }
        ) {
          if (err) done(err);

          expect(article.includes(randomId)).toBe(true);
          done();
        });
    });
  });

  describe("(GET) Get all Articles Tests Suite", () => {
    it("should get all Articles successfully (200)", (done) => {
      request(app)
        .get(route)
        .expect(200)
        .end(function (
          err,
          {
            body: {
              data: { article },
            },
          }
        ) {
          if (err) done(err);

          expect(article).toBeDefined();
          done();
        });
    });
  });
});
