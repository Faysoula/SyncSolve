const express = require("express");
const {
  createTeamController,
  getTeamsController,
  getTeamByNameController,
  getTeamMembersController,
  updateTeamNameController,
  deleteTeamController,
} = require("../controllers/teamController");

const auth = require("../middleware/auth"); // Middleware for authentication

const router = express.Router();

// Route to create a new team
router.post("/Createteam", auth, createTeamController);

// Route to get all teams
router.get("/", auth, getTeamsController);

// Route to get a team by name
router.get("/:team_name", auth, getTeamByNameController);

// Route to get all members of a team by team ID
router.get("/:id/members", auth, getTeamMembersController);

// Route to update team name
router.put("/:id", auth, updateTeamNameController);

// Route to delete a team
router.delete("/:id", auth, deleteTeamController);

module.exports = router;
