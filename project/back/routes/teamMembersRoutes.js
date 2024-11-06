const express = require('express');

const {
    addTeamMemberController,
    getTeamMembersController,
    getTeamMemberByIdController,
    updateTeamMemberRoleController,
    removeTeamMemberController,
} = require("../controllers/teamMemberController");

const auth = require("../middleware/auth");

const router = express.Router();

// Route to add a team member
router.post("/addMembers", auth, addTeamMemberController);

// Route to get members of a team by team ID
router.get("/members/:team_id", auth, getTeamMembersController);

// Route to get a team member by user ID
router.get("/:user_id", auth, getTeamMemberByIdController);

// Route to update a team member's role
router.put("/members/ChangeRole", auth, updateTeamMemberRoleController);

// Route to remove a team member
router.delete(
  "/removeMember/:team_member_id",
  auth,
  removeTeamMemberController
);

module.exports = router;