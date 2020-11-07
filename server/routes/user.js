const express = require("express");

const { createOne } = require("../controllers/user");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.post("/", authMiddleware, createOne);

module.exports = router;
