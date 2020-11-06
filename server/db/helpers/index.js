const classes = require("../classes");

const initDb = () =>
  Promise.all(Object.values(classes).map((Class) => Class.init()));

module.exports = {
  initDb,
};
