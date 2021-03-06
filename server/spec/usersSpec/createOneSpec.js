const request = require("supertest");

const { User } = require("../../db/classes");
const { app, routeInitialText } = require("../../index");
const { getValidToken } = require("../../helpers/token");
const {
  NO_USER_SENT,
  CREATE_USER_WRONG_PROPERTY,
} = require("../../constants/responsesMessages/user");

const route = `${routeInitialText}/users`;
const userToSave = {
  name: "name",
  avatar: "avatar",
};
const validToken = getValidToken();

describe("(POST) Create User Tests Suite: ", () => {
  beforeAll(async () => {
    await User.init();
  });

  beforeEach(async () => {
    await User.users.deleteMany({});
  });

  afterAll(async () => {
    await User.users.deleteMany({});
  });

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
