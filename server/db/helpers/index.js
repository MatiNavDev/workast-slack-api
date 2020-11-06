const { ObjectId } = require("mongodb");

const classes = require("../classes");

/**
 * Init all classes in DB
 */
const initDb = () =>
  Promise.all(Object.values(classes).map((Class) => Class.init()));

/**
 * Transform a string into an ObjectId
 * @param {string} id
 */
const getObjectId = (id) => new ObjectId(id);

module.exports = {
  initDb,
  getObjectId,
};
