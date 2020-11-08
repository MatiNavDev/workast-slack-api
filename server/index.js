const express = require("express");
const bodyParser = require("body-parser");

const { initDb } = require("./db/helpers");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const Slack = require("./integrations/slack");

const routeInitialText = "/workast-api/v1";

const app = express();
app.use(bodyParser.json());

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Initialize app routes
app.use(`${routeInitialText}/users`, userRoutes);
app.use(`${routeInitialText}/articles`, articleRoutes);

const PORT = process.env.PORT || 3007;

/**
 * Init app and DB
 */
const init = async () => {
  await initDb();
  if (process.env.NODE_ENV === "prod") {
    app.listen(PORT, () =>
      console.log(`Workast project running in port: ${PORT}`)
    );
    Slack.init();
  }
};

init();

module.exports = {
  app,
  routeInitialText,
  init,
};
