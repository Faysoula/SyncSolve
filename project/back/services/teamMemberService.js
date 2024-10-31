const TeamMember = require("../models/TeamMember");
const Team = require("../models/team");
const User = require("../models/user");

const addTeamMember = async (team_id, user_id, role) => {
  try {
    const newRole = role.toLowerCase();
    const team = await Team.findByPk(team_id);
    if (!team) {
      throw new Error("Team not found");
    }


    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const count = await TeamMember.count({
      where: {
        team_id,
      },
    });
    
    const existingmbr = await TeamMember.findOne({
      where: {
        team_id,
        user_id,
      },
    })

    if(existingmbr){
      throw new Error("User already in team");
    }

    if (count >= 3) {
      throw new Error("Team is full");
    }
    
    if(newRole === "admin"){
      const countAdmin = await TeamMember.count({
        where: {
          team_id,
          role: "admin",
        },
      })
      if(countAdmin > 0){
        throw new Error("Team already has an admin");
      }
    }
    const teamMember = await TeamMember.create({
      team_id,
      user_id,
      role: newRole,
    });

    return teamMember;
  } catch (err) {
    throw new Error(`Error adding team member: ${err.message}`);
  }
};

const getTeamMembers = async (team_id) => {
  try {
    const teamMembers = await TeamMember.findAll({
      where: {
        team_id,
      },
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });

    return teamMembers;
  } catch (err) {
    throw new Error(`Error getting team members: ${err.message}`);
  }
};

const updateTeamMemberRole = async (team_member_id, role) => {
  try {
    const [affectedrows] = await TeamMember.update(
      {
        role,
      },
      {
        where: {
          team_member_id,
        },
      }
    );

    if (affectedrows === 0) {
      throw new Error("Team member not found");
    }

    return await TeamMember.findByPk(team_member_id);
  } catch (err) {
    throw new Error(`Error updating team member role: ${err.message}`);
  }
};

const removeTeamMember = async (team_member_id) => {
  try {
    const teamMember = await TeamMember.findByPk(team_member_id);
    if (!teamMember) {
      throw new Error("Team member not found");
    }

    await TeamMember.destroy({
      where: {
        team_member_id,
      },
    });

    return { message: "Team member removed successfully" };
  } catch (err) {
    throw new Error(`Error removing team member: ${err.message}`);
  }
};

module.exports = {
  addTeamMember,
  getTeamMembers,
  updateTeamMemberRole,
  removeTeamMember,
};
