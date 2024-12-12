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
/**
 * @swagger
 * tags:
 *   name: Terminal
 *   description: Code execution terminal management
 * 
 * /api/terminal/createTerminal:
 *   post:
 *     summary: Create a new terminal session
 *     tags: [Terminal]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - language
 *             properties:
 *               session_id:
 *                 type: integer
 *               language:
 *                 type: string
 *                 enum: [Cpp, Java, Python]
 *     responses:
 *       201:
 *         description: Terminal session created successfully
 */
// Routes
// Create a new terminal session
router.post("/createTerminal", createTerminalSessionController);

// Get all terminal sessions
/**
 * @swagger
 * /api/terminal:
 *   get:
 *     summary: Get all terminal sessions
 *     tags: [Terminal]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Terminal sessions retrieved successfully
 */
router.get("/", getTerminalSessionsController);

// Get a terminal session by ID
/**
 * @swagger
 * /api/terminal/{id}:
 *   get:
 *     summary: Get a terminal session by ID
 *     tags: [Terminal]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", getTerminalSessionsByidController);

// Get all terminal sessions by session ID
/**
 * @swagger
 * /api/terminal/session/{id}:
 *   get:
 *     summary: Get all terminal sessions by session ID
 *     tags: [Terminal]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/session/:id", getTerminalSessionsBySessionIdController);

// Update last active time
/**
 * @swagger
 * /api/terminal/{id}:
 *   put:
 *     summary: Update last active time of a terminal session
 *     tags: [Terminal]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/:id", updateLastActiveController);

// Delete a terminal session
/**
 * @swagger
 * /api/terminal/{id}:
 *   delete:
 *     summary: Delete a terminal session
 *     tags: [Terminal]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/:id", deleteTerminalSessionController);

module.exports = router;
