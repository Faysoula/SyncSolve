const {
    createTeam,
    getTeams,
    getTeamByName,
    getTeamMembers,
    getTeamById,
    updateTeamName,
    deleteTeam,
} = require("../services/teamService");

const createTeamController = async (req, res) => {
    const { team_name, created_by } = req.body;

    try {
        const team = await createTeam(team_name, created_by);
        res.status(201).json({ message: "Team created successfully", team });
    } catch (err) {
        console.error("Error creating team:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const getTeamByIdController = async (req, res) => {
    const team_id = req.params.id;
    try {
        const team = await getTeamById(team_id);
        res.status(200).json(team);
    } catch (err) {
        console.error("Error getting team by id:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const getTeamsController = async (req, res) => {
    try {
        const teams = await getTeams();
        res.status(200).json({ teams });
    } catch (err) {
        console.error("Error getting all teams:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const getTeamByNameController = async (req, res) => {
    const { team_name } = req.params;
    try {
        const team = await getTeamByName(team_name);
        res.status(200).json(team);
    } catch (err) {
        console.error("Error getting team by name:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const getTeamMembersController = async (req, res) => {
    const team_id = req.params.id;
    try {
        const teamMembers = await getTeamMembers(team_id);
        res.status(200).json(teamMembers);
    } catch (err) {
        console.error("Error getting team members:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const updateTeamNameController = async (req, res) => {
    const team_id = req.params.id;
    const { team_name } = req.body;
    try {
        const updatedTeam = await updateTeamName(team_id, team_name);
        res.status(200).json({ message: "Team updated successfully", updatedTeam });
    } catch (err) {
        console.error("Error updating team:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const deleteTeamController = async (req, res) => {
    const team_id = req.params.id;
    try {
        const message = await deleteTeam(team_id);
        res.status(200).json(message);
    } catch (err) {
        console.error("Error deleting team:", err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createTeamController,
    getTeamByIdController,
    getTeamsController,
    getTeamByNameController,
    getTeamMembersController,
    updateTeamNameController,
    deleteTeamController,
};