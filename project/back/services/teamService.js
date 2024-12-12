const Team = require("../models/team");
const TeamMember = require("../models/TeamMember");
const User = require("../models/user");

// Create a new team
const createTeam = async (team_name, creator_id) => {
  try {
    const user = await User.findByPk(creator_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if team name already exists
    const team = await Team.create({
      team_name,
    });

    await TeamMember.create({
      team_id: team.team_id,
      user_id: creator_id,
      role: "admin",
    });

    return team;
  } catch (err) {
    throw new Error(`Error creating team: ${err.message}`);
  }
};

// Retrieve all teams
const getTeams = async () => {
  try {
    const teams = await Team.findAll();
    return teams;
  } catch (err) {
    throw new Error(`Error getting teams: ${err.message}`);
  }
};

// Retrieve a team by its name
const getTeamByName = async (team_name) => {
  try {
    // Include team members
    const team = await Team.findOne({
      where: {
        team_name,
      },
      // Include team members and user details
      include: [
        {
          model: TeamMember,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
          attributes: ["role", "joined_at"],
        },
      ],
    });
    if (!team) {
      throw new Error("Team not found");
    }
    return team;
  } catch (err) {
    throw new Error(`Error getting team by id: ${err.message}`);
  }
};

// Retrieve all team members for a specific team
const getTeamMembers = async (team_id) => {
  try {
    const teamMembers = await TeamMember.findAll({
      where: {
        team_id,
      },
      include: [User],
    });

    return teamMembers;
  } catch (err) {
    throw new Error(`Error getting team members: ${err.message}`);
  }
};

// Retrieve a team by its ID
const getTeamById = async (team_id) => {
  try {
    const team = await Team.findByPk(team_id);
    if (!team) {
      throw new Error("Team not found");
    }
    return team;
  } catch (err) {
    throw new Error(`Error getting team by id: ${err.message}`);
  }
};

// Update a team's name
const updateTeamName = async (team_id, team_name) => {
  const [updatedRows] = await Team.update(
    { team_name },
    { where: { team_id } }
  );
  if (updatedRows === 0) throw new Error("Team not found");
  return await Team.findByPk(team_id);
};

const deleteTeam = async (team_id) => {
  try {
    const team = await Team.findByPk(team_id);
    if (!team) {
      throw new Error("Team not found");
    }

    await team.destroy();
    return { message: "Team deleted successfully" };
  } catch (err) {
    throw new Error(`Error deleting team: ${err.message}`);
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamByName,
  getTeamMembers,
  getTeamById,
  updateTeamName,
  deleteTeam,
};
