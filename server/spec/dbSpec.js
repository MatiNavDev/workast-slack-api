const DBInstance = require("../db");

describe("Verify Connection to DB", () => {
  beforeAll(async () => {
    await DBInstance.init();
    this.users = DBInstance.db.collection("users");
  });

  it("should query to users successfully ", async () => {
    await this.users.find({});
  });
});
