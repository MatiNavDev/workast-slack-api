const mock = require("mock-require");

/**
 * Mock Slack and init that Slack Mocked Instance
 * @param {Function} slackSpy
 */
function mockAndInitSlack(slackSpy) {
  mock("@slack/web-api", {
    WebClient: class {
      constructor(token) {
        slackSpy(token);

        this.chat = {
          postMessage: async function (...args) {
            slackSpy(args);
          },
        };
      }
    },
  });

  const Slack = mock.reRequire("../../integrations/slack");
  Slack.init();
  return Slack;
}

module.exports = {
  mockAndInitSlack,
};
