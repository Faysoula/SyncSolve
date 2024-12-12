const {
  createTerminalSessionController,
  getTerminalSessionsController,
  getTerminalSessionsByidController,
  getTerminalSessionsBySessionIdController,
  updateLastActiveController,
  deleteTerminalSessionController,
} = require("../controllers/terminalController");

const express = require("express");
const router = express.Router();

// Routes
// Create a new terminal session
router.post("/createTerminal", createTerminalSessionController);

// Get all terminal sessions
router.get("/", getTerminalSessionsController);

// Get a terminal session by ID
router.get("/:id", getTerminalSessionsByidController);

// Get all terminal sessions by session ID
router.get("/session/:id", getTerminalSessionsBySessionIdController);

// Update last active time
router.put("/:id", updateLastActiveController);

// Delete a terminal session
router.delete("/:id", deleteTerminalSessionController);

module.exports = router;
