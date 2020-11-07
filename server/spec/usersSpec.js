const request = require("supertest");

const { User } = require("../db/classes");
const { app, routeInitialText } = require("../index");
const {
  NO_USER_SENT,
  CREATE_USER_WRONG_PROPERTY,
} = require("../constansts/responsesMessages/user");

const {
  NO_TOKEN,
  INVALID_TOKEN,
} = require("../constansts/responsesMessages/middlewares");

const route = `${routeInitialText}/users`;
const userToSave = {
  name: "name",
  avatar: "avatar",
};

const validToken = jwt.sign(
  {
    data: "you are a valid user :)",
  },
  jwtSecret,
  { expiresIn: "1h" }
);
const invalidToken = validToken.slice(3, validToken.length) + "abcd";

describe("Users Tets Suite", () => {
  beforeAll(async () => {
    await User.init();
  });

  beforeEach(async () => {
    await User.users.deleteMany({});
  });

  afterAll(async () => {
    await User.users.deleteMany({});
  });

  describe("(POST) Create User Tests Suite: ", () => {
    it("should create an User successfully (200)", async () => {
      const {
        body: {
          data: { user: userParam },
        },
      } = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${validToken}`)
        .send({ user: userToSave })
        .expect(200);
      const usersFromDB = await User.users.find({}).toArray();

      expect(usersFromDB.length).toBe(1);
      expect(usersFromDB[0]).toEqual(jasmine.objectContaining(userToSave));
      expect(usersFromDB[0]._id.toString()).toBe(userParam._id);
    });

    it("should fail because no user sent (422)", async () => {
      const {
        body: { message },
      } = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${validToken}`)
        .expect(422);

      expect(message).toBe(NO_USER_SENT);
    });

    it("should fail because missing property (422)", async () => {
      const {
        body: { message },
      } = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${validToken}`)
        .send({ user: { name: "name" } })
        .expect(422);

      expect(message).toBe(CREATE_USER_WRONG_PROPERTY);
    });
  });

  using(
    [
      {
        name: "Create One User",
        method: "post",
        route,
      },
    ],
    (data) => {
      describe(`Authentication Test ${data.name}`, () => {
        it("should not validate successfully because no token (401)", async () => {
          const {
            body: { message },
          } = await request(app)[data.method](`${data.route}`).expect(401);

          expect(message).toBe(NO_TOKEN);
        });

        it("should not validate successfully because no token (401)", async () => {
          const {
            body: { message },
          } = await request(app)
            [data.method](`${data.route}`)
            .set("Authorization", `Bearer ${invalidToken}`)
            .expect(401);

          expect(message).toBe(INVALID_TOKEN);
        });
      });
    }
  );
});
