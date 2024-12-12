const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createMessageController,
  getTeamMessagesController,
} = require("../controllers/chatController");


// Routes
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Team chat functionality endpoints
 * 
 * /api/chat/message:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_id
 *               - message
 *             properties:
 *               team_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 * 
 * /api/chat/team/{team_id}:
 *   get:
 *     summary: Get team chat messages
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team messages retrieved successfully
 */
// Create a new message
router.post("/message", auth, createMessageController);
// Get all messages by team ID
router.get("/team/:team_id", auth, getTeamMessagesController);

module.exports = router;
