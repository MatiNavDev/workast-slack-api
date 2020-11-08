const using = require("jasmine-data-provider");

const { routeInitialText } = require("../../index");
const { invalidTokenTest, noTokenTest } = require("../asserts/middleware");

const route = `${routeInitialText}/users`;

describe("Users Auth Tets Suite", () => {
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
          await noTokenTest(data.method, data.route);
        });

        it("should not validate successfully because no token (401)", async () => {
          await invalidTokenTest(data.method, data.route);
        });
      });
    }
  );
});
