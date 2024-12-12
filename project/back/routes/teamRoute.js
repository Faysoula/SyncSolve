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

const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         team_id:
 *           type: integer
 *           description: The auto-generated id of the team
 *         team_name:
 *           type: string
 *           description: The name of the team
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when team was created
 *     TeamMember:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         username:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, member]
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Team management endpoints
 */

/**
 * @swagger
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
 *                 description: Name of the team
 *               created_by:
 *                 type: integer
 *                 description: User ID of team creator
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/Createteam", auth, createTeamController);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", auth, getTeamsController);

/**
 * @swagger
 * /api/teams/name/{team_name}:
 *   get:
 *     summary: Get a team by name
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the team to find
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 */
router.get("/name/:team_name", auth, getTeamByNameController);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", auth, getTeamByIdController);

/**
 * @swagger
 * /api/teams/{id}/members:
 *   get:
 *     summary: Get all members of a team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     responses:
 *       200:
 *         description: List of team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMember'
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id/members", auth, getTeamMembersController);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update team name
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
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
 *                 description: New team name
 *     responses:
 *       200:
 *         description: Team name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", auth, updateTeamNameController);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", auth, deleteTeamController);

module.exports = router;
