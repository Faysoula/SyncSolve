const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createMessageController,
  getTeamMessagesController,
} = require("../controllers/chatController");

router.post("/message", auth, createMessageController);
router.get("/team/:team_id", auth, getTeamMessagesController);

module.exports = router;
