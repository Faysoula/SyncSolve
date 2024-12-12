const express = require('express');

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
 *   description: Team membership management
 * 
 * /api/team-members/addMembers:
 *   post:
 *     summary: Add a member to a team
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
// Route to add a team member
router.post("/addMembers", auth, addTeamMemberController);

// Route to get members of a team by team ID
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
 *         description: Team members retrieved successfully
 */
router.get("/members/:team_id", auth, getTeamMembersController);

// Route to get a team by user ID
/**
 * @swagger
 * /api/team-members/members/{user_id}:
 *   get:
 *     summary: Get team of a user
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
 *         description: Team retrieved successfully
 */
router.get("/members/:user_id", auth, getUserTeamController);

// Route to get a team member by user ID
/**
 * @swagger
 * /api/team-members/{user_id}:
 *   get:
 *     summary: Get a team member by user ID
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
 *         description: Team member retrieved successfully
 */
router.get("/:user_id", auth, getTeamMemberByIdController);

// Route to update a team member's role
/**
 * @swagger
 * /api/team-members/members/ChangeRole:
 *   put:
 *     summary: Change a team member's role
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
 *         description: Team member role updated successfully
 */
router.put("/members/ChangeRole", auth, updateTeamMemberRoleController);

// Route to remove a team member
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