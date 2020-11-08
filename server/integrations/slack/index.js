const { WebClient } = require("@slack/web-api");

class Slack {
  /**
   * Init Slack instance
   */
  init() {
    this.web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
  }

  /**
   * Post text message in channel
   * @param {string} channel
   * @param {string} text
   */
  sendMessageToChannel(channel, text) {
    return this.web.chat.postMessage({
      channel,
      text,
    });
  }

  /**
   * Post text in #general channel
   * @param {string} text
   */
  sendMessageToGeneralChannel(text) {
    return this.sendMessageToChannel("#general", text);
  }
}

module.exports = new Slack();
