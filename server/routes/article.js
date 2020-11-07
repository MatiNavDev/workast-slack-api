const express = require("express");

const {
  createOne,
  editOne,
  deleteOne,
  getAll,
} = require("../controllers/article");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/", authMiddleware, getAll);
router.post("/", authMiddleware, createOne);
router.put("/:id", authMiddleware, editOne);
router.delete("/:id", authMiddleware, deleteOne);

module.exports = router;
