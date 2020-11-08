const { mockAndInitSlack } = require("./helpers/slack");

const slackMessage = "someMessage";

describe("Slack Unit Test Suite", () => {
  const slackSpy = jasmine.createSpy("slackSpy");

  beforeAll(() => {
    this.Slack = mockAndInitSlack(slackSpy);
  });

  afterEach(() => {
    slackSpy.calls.reset();
  });

  it("should send successfully a message to channel", async () => {
    await this.Slack.sendMessageToGeneralChannel(slackMessage);

    expect(slackSpy.calls.mostRecent().args[0][0]).toEqual(
      jasmine.objectContaining({
        channel: "#general",
        text: slackMessage,
      })
    );
  });
});
