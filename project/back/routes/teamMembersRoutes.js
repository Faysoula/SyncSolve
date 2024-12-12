const express = require("express");
const {
  addTeamMemberController,
  getTeamMembersController,
  getTeamMemberByIdController,
  getUserTeamController,
  updateTeamMemberRoleController,
  removeTeamMemberController,
} = require("../controllers/teamMemberController");

const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Team Members
 *   description: Team member management
 *
 * /api/team-members/addMembers:
 *   post:
 *     summary: Add a new team member
 *     tags: [Team Members]
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
 *               - user_id
 *               - role
 *             properties:
 *               team_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [member, admin]
 *     responses:
 *       201:
 *         description: Team member added successfully
 */
router.post("/addMembers", auth, addTeamMemberController);

/**
 * @swagger
 * /api/team-members/members/{team_id}:
 *   get:
 *     summary: Get all members of a team
 *     tags: [Team Members]
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
 *         description: List of team members
 */
router.get("/members/:team_id", auth, getTeamMembersController);

/**
 * @swagger
 * /api/team-members/{user_id}:
 *   get:
 *     summary: Get teams for a user
 *     tags: [Team Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's team information
 */
router.get("/:user_id", auth, getTeamMemberByIdController);

/**
 * @swagger
 * /api/team-members/members/{user_id}:
 *   get:
 *     summary: Get user's team
 *     tags: [Team Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's team information
 */
router.get("/members/:user_id", auth, getUserTeamController);

/**
 * @swagger
 * /api/team-members/members/ChangeRole:
 *   put:
 *     summary: Update team member's role
 *     tags: [Team Members]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_member_id
 *               - role
 *             properties:
 *               team_member_id:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [member, admin]
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.put("/members/ChangeRole", auth, updateTeamMemberRoleController);

/**
 * @swagger
 * /api/team-members/removeMember/{team_member_id}:
 *   delete:
 *     summary: Remove a team member
 *     tags: [Team Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_member_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team member removed successfully
 */
router.delete(
  "/removeMember/:team_member_id",
  auth,
  removeTeamMemberController
);

module.exports = router;
