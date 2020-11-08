const using = require("jasmine-data-provider");

const { routeInitialText } = require("../../index");
const { invalidTokenTest, noTokenTest } = require("../asserts/middleware");

const route = `${routeInitialText}/articles`;

describe("Articles Auth Tets Suite", () => {
  using(
    [
      {
        name: "Create One Article",
        method: "post",
        route,
      },
      {
        name: "Edit One Article",
        method: "put",
        route: `${route}/someId`,
      },
      {
        name: "Delete One Article",
        method: "delete",
        route: `${route}/someId`,
      },
      {
        name: "Get All Articles",
        method: "get",
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
