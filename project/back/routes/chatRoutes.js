const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createMessageController,
  getTeamMessagesController,
} = require("../controllers/chatController");


// Routes
// Create a new message
router.post("/message", auth, createMessageController);
// Get all messages by team ID
router.get("/team/:team_id", auth, getTeamMessagesController);

module.exports = router;
