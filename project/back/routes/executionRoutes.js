const express = require("express");
const {
  createExecutionController,
  getAllExecutionsController,
  getExecutionsBySessionIdController,
  getExecutionsByUserIdController,
  getExecutionByIdController,
  updateExecutionController,
  deleteExecutionController,
} = require("../controllers/executionController");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Code Execution
 *   description: Code execution and testing endpoints
 * 
 * /api/executions/createEx:
 *   post:
 *     summary: Execute code
 *     tags: [Code Execution]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - code
 *               - terminal_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               code:
 *                 type: string
 *               terminal_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Code executed successfully
 */
router.post("/createEx", createExecutionController);
/**
 * @swagger
 * /api/executions:
 *   get:
 *     summary: Get all code executions
 *     tags: [Code Execution]
 *     responses:
 *       200:
 *         description: Code executions retrieved successfully
 */
router.get("/", getAllExecutionsController);
/**
 * @swagger
 * /api/executions/session/{session_id}:
 *   get:
 *     summary: Get all code executions by session ID
 *     tags: [Code Execution]
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code executions retrieved successfully
 */
router.get("/session/:session_id", getExecutionsBySessionIdController);
/**
 * @swagger
 * /api/executions/user/{user_id}:
 *   get:
 *     summary: Get all code executions by user ID
 *     tags: [Code Execution]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code executions retrieved successfully
 */
router.get("/user/:user_id", getExecutionsByUserIdController);
/**
 * @swagger
 * /api/executions/{execution_id}:
 *   get:
 *     summary: Get code execution by ID
 *     tags: [Code Execution]
 *     parameters:
 *       - in: path
 *         name: execution_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code execution retrieved successfully
 */
router.get("/:execution_id", getExecutionByIdController);
/**
 * @swagger
 * /api/executions/{execution_id}:
 *   put:
 *     summary: Update code execution by ID
 *     tags: [Code Execution]
 *     parameters:
 *       - in: path
 *         name: execution_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code execution updated successfully
 */
router.put("/:execution_id", updateExecutionController);
/**
 * @swagger
 * /api/executions/{execution_id}:
 *   delete:
 *     summary: Delete code execution by ID
 *     tags: [Code Execution]
 *     parameters:
 *       - in: path
 *         name: execution_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code execution deleted successfully
 */
router.delete("/:execution_id", deleteExecutionController);

module.exports = router;
