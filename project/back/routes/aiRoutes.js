const express = require("express");
const { getCodeSuggestion } = require("../controllers/aiController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/suggestion", auth, getCodeSuggestion);

module.exports = router;
