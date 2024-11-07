const {
  createSession,
  getSessions,
  getSessionById,
  getSessionByTeam,
  endSession,
  updateSession,
  deleteSession,
} = require("../services/sessionService");

const createSessionController = async (req, res) => {
  const { team_id, problem_id } = req.body;

  try {
    const session = await createSession(team_id, problem_id);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSessionsController = async (req, res) => {
  try {
    const sessions = await getSessions();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSessionByIdController = async (req, res) => {
  const session_id = req.params.id;

  try {
    const session = await getSessionById(session_id);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSessionByTeamController = async (req, res) => {
  const team_id = req.params.id;

  try {
    const sessions = await getSessionByTeam(team_id);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const endSessionController = async (req, res) => {
  const session_id = req.params.id;

  try {
    const session = await endSession(session_id);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSessionController = async (req, res) => {
  const session_id = req.params.id;
  const { problem_id } = req.body;

  try {
    const session = await updateSession(session_id, problem_id);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const deleteSessionController = async (req, res) => {
  const session_id = req.params.id;

  try {
    await deleteSession(session_id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createSessionController,
  getSessionsController,
  getSessionByIdController,
  getSessionByTeamController,
  endSessionController,
  updateSessionController,
  deleteSessionController,
};
