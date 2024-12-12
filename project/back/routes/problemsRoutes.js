const {
  addProblemController,
  getAllProblemsController,
  getProblemBYDifficultyController,
  getProblemByIdController,
  updateProblemController,
  deleteProblemController,
  searchByTagsController,
  getAllTagsController,
  getDailyProblemController,
} = require("../controllers/problemController");

const express = require("express");
const router = express.Router();

const cache = require("../middleware/cache");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Problems
 *   description: Programming problems management
 *
 * /api/problems/addProblem:
 *   post:
 *     summary: Create a new problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problem'
 *     responses:
 *       201:
 *         description: Problem created successfully
 *
 * /api/problems/getAllProblems:
 *   get:
 *     summary: Get all problems
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all problems
 *
 * /api/problems/daily:
 *   get:
 *     summary: Get daily problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daily problem retrieved successfully
 */

router.get("/Tags", getAllTagsController);
// Add a new problem
/**
 * @swagger
 * components:
 *   schemas:
 *     Problem:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - difficulty
 *         - tags
 *         - testCases
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         testCases:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *               output:
 *                 type: string
 *       example:
 *         title: "Two Sum"
 *         description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target."
 *         difficulty: "easy"
 *         tags: ["array", "hash table"]
 *         testCases:
 *           - input: "[2,7,11,15], 9"
 *             output: "[0,1]"
 */
router.post("/addProblem", auth, addProblemController);

// Get all problems
/**
 * @swagger
 * /api/problems/getAllProblems:
 *   get:
 *     summary: Get all problems
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all problems
 */
router.get("/getAllProblems", cache(300), getAllProblemsController);

// Get problems by difficulty
/**
 * @swagger
 * /api/problems/getProblemBYDifficulty/{difficulty}:
 *   get:
 *     summary: Get problems by difficulty
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: difficulty
 *         required: true
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: List of problems by difficulty
 */
router.get(
  "/getProblemBYDifficulty/:difficulty",
  getProblemBYDifficultyController
);

// Get problems by tags
/**
 * @swagger
 * /api/problems/searchByTags:
 *   get:
 *     summary: Get problems by tags
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of problems by tags
 */
router.get("/searchByTags", searchByTagsController);

// Get all tags

// Update a problem
/**
 * @swagger
 * /api/problems/updateProblem/{id}:
 *   put:
 *     summary: Update a problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problem'
 *     responses:
 *       200:
 *         description: Problem updated successfully
 */
router.put("/updateProblem/:id", auth, updateProblemController);

// Get daily problem
/**
 * @swagger
 * /api/problems/daily:
 *   get:
 *     summary: Get daily problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daily problem retrieved successfully
 */
router.get("/daily", cache(3600), getDailyProblemController);
router.get("/:id", cache(600), getProblemByIdController);
// Delete a problem
/**
 * @swagger
 * /api/problems/deleteProblem/{id}:
 *   delete:
 *     summary: Delete a problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Problem deleted successfully
 */
router.delete("/deleteProblem/:id", auth, deleteProblemController);

module.exports = router;
