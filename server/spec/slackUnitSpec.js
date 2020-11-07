const mock = require("mock-require");

const slackToken = "someToken";
const slackMessage = "someMessage";

describe("Slack Unit Test Suite", () => {
  const slackSpy = jasmine.createSpy("slackSpy");

  beforeAll(() => {
    process.env.SLACK_OAUTH_TOKEN = slackToken;

    mock("@slack/web-api", {
      WebClient: class {
        constructor(token) {
          slackSpy(token);

          this.chat = {
            postMessage: function (...args) {
              slackSpy(args);
            },
          };
        }
      },
    });
  });

  afterEach(() => {
    slackSpy.calls.reset();
  });

  it("should send successfully a message to channel", () => {
    this.Slack.sendMessageToGeneralChannel(slackMessage);

    expect(slackSpy.calls.all()[0].args[0]).toBe(slackToken);
    expect(slackSpy.calls.all()[1].args[0][0]).toEqual(
      jasmine.objectContaining({
        channel: "#general",
        text: slackMessage,
      })
    );
  });
});
