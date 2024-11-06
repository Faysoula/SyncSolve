const {
  addTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMemberRole,
  removeTeamMember,
} = require("../services/teamMemberService");

const addTeamMemberController = async (req, res) => {
  const { team_id, user_id, role } = req.body;

  try {
    const teamMember = await addTeamMember(team_id, user_id, role);
    res
      .status(201)
      .json({ message: "Team member added successfully", teamMember });
  } catch (error) {
    console.log("error entering team", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTeamMembersController = async (req, res) => {
  const { team_id } = req.params;

  try {
    const teamMembers = await getTeamMembers(team_id);
    res.status(200).json({ teamMembers });
  } catch (error) {
    console.log("Cannot find members", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTeamMemberByIdController = async (req, res) => {
  const { user_id } = req.params;

  try {
    const teamMembers = await getTeamMemberById(user_id);
    res.status(200).json({ teamMembers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateTeamMemberRoleController = async (req, res) => {
    const { team_member_id, role } = req.body;

    try{
        const updatedTeamMember = await updateTeamMemberRole(team_member_id, role);
        res.status(200).json({message: "Team member role updated successfully", updatedTeamMember});
    }catch(error){
        console.log("cannot update role", error.message);
        res.status(500).json({message: error.message})
    }
}

const removeTeamMemberController = async (req, res) => {
    const { team_member_id } = req.params;

    try{
        const message = await removeTeamMember(team_member_id);
        res.status(200).json(message);
    }catch(error){
        console.log("cannot remove team member", error.message);
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    addTeamMemberController,
    getTeamMembersController,
    getTeamMemberByIdController,
    updateTeamMemberRoleController,
    removeTeamMemberController,
    };


