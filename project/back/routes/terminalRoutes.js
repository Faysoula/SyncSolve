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

router.post("/createTerminal", createTerminalSessionController);
router.get("/", getTerminalSessionsController);
router.get("/:id", getTerminalSessionsByidController);
router.get("/session/:id", getTerminalSessionsBySessionIdController);
router.put("/:id", updateLastActiveController);
router.delete("/:id", deleteTerminalSessionController);

module.exports = router;
