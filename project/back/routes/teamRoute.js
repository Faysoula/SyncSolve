const express = require("express");
const {
  createTeamController,
  getTeamByIdController,
  getTeamsController,
  getTeamByNameController,
  getTeamMembersController,
  updateTeamNameController,
  deleteTeamController,
} = require("../controllers/teamController");

const auth = require("../middleware/auth"); // Middleware for authentication

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Team management
 * 
 * /api/teams/Createteam:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_name
 *               - created_by
 *             properties:
 *               team_name:
 *                 type: string
 *               created_by:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Team created successfully
 */
// Route to create a new team
router.post("/Createteam", auth, createTeamController);

// Route to get all teams
/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 */
router.get("/", auth, getTeamsController);

// Route to get a team by name
/**
 * @swagger
 * /api/teams/name/{team_name}:
 *   get:
 *     summary: Get a team by name
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 */
router.get("/name/:team_name", auth, getTeamByNameController);

// Route to get a team by ID
/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 */
router.get("/:id", auth, getTeamByIdController);

// Route to get all members of a team by team ID
/**
 * @swagger
 * /api/teams/{id}/members:
 *   get:
 *     summary: Get all members of a team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 */
router.get("/:id/members", auth, getTeamMembersController);

// Route to update team name
/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update team name
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_name
 *             properties:
 *               team_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team name updated successfully
 */
router.put("/:id", auth, updateTeamNameController);

// Route to delete a team
/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 */
router.delete("/:id", auth, deleteTeamController);

module.exports = router;
