const { mockAndInitSlack } = require("../helpers/slack");
const createOneSpy = jasmine.createSpy("createOneSpy");

mockAndInitSlack(createOneSpy);

module.exports = {
  createOneSpy,
};
