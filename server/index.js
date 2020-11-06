const express = require("express");
const bodyParser = require("body-parser");

const DBInstance = require("./db");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");

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

const init = async () => {
  await DBInstance.init();
  app.listen(PORT, () =>
    console.log(`Workast project running in port: ${PORT}`)
  );
};

init();

module.exports = {
  app,
  routeInitialText,
};
