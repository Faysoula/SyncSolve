const express = require("express");
const { getCodeSuggestion } = require("../controllers/aiController");
const auth = require("../middleware/auth");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: AI Assistant
 *   description: AI code assistance endpoints
 * 
 * /api/ai/suggestion:
 *   post:
 *     summary: Get AI suggestion for code
 *     tags: [AI Assistant]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - code
 *               - problemDescription
 *               - testCases
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: User's question or prompt
 *               code:
 *                 type: string
 *                 description: Current code content
 *               problemDescription:
 *                 type: string
 *                 description: Problem description
 *               testCases:
 *                 type: array
 *                 description: Test cases for the problem
 *     responses:
 *       200:
 *         description: AI suggestion received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: AI generated suggestion
 */

router.post("/suggestion", auth, getCodeSuggestion);

module.exports = router;
