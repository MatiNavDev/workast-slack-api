const request = require("supertest");

const { app, routeInitialText } = require("../index");

const route = `${routeInitialText}/users`;
const userToSave = {
  name: "name",
  avatar: "avatar",
};

describe("Users Tets Suite", () => {
  beforeAll(async () => {
    await DBInstance.init();
    this.users = DBInstance.db.collection("users");
  });

  describe("(POST) Create User Tests Suite: /users", () => {
    it("should create an User successfully (200)", async () => {
      const {
        body: {
          data: { user: userParam },
        },
      } = request(app).post(route).send(userToSave).expect(200);

      const usersFromDB = await this.users.find({}).toArray();

      expect(usersFromDB.length).toBe(1);
      expect(usersFromDB[0]).toContain(userParam);
    });

    it("should fail because no user sent", () => {
      const {
        body: { message },
      } = request(app).post(route).expect(500);

      expect(message).toBe(NO_USER_SENT);
    });
  });
});
