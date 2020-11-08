/**
 * Test a correct call to slack api methods
 * @param {Function} spy
 * @param {any} user
 * @param {any} article
 */
function slackTest(spy, user, article) {
  expect(spy.calls.mostRecent().args[0][0]).toEqual(
    jasmine.objectContaining({
      channel: "#general",
      text: `${user.name} has a new post: ${article.text}. Check it out!!`,
    })
  );
}

module.exports = {
  slackTest,
};
