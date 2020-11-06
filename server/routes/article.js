const express = require("express");

const {
  createOne,
  editOne,
  deleteOne,
  getAll,
} = require("../controllers/article");

const router = express.Router();

router.get("/", getAll);
router.post("/", createOne);
router.put("/:id", editOne);
router.delete("/:id", deleteOne);

module.exports = router;
