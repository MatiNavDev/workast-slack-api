const express = require("express");

const { createOne } = require("../controllers/user");

const router = express.Router();

router.post("/", createOne);

module.exports = router;
