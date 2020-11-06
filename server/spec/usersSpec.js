const request = require("supertest");

const { app, routeInitialText } = require("../index");

const route = `${routeInitialText}/users`;

describe("Users Tets Suite", () => {
  describe("(POST) Create Article Tests Suite: /users", () => {
    it("should create a Article successfully (200)", (done) => {
      request(app)
        .post(route)
        .expect(200)
        .end(function (
          err,
          {
            body: {
              data: { user },
            },
          }
        ) {
          if (err) done(err);

          expect(user).toBeDefined();
          done();
        });
    });
  });
});
