const {
  createTerminalSession,
  getTerminalSessions,
  getTerminalSessionsByid,
  getTerminalSessionsBySessionId,
  updateLastActive,
  deleteTerminalSession,
} = require("../services/terminalService");

const createTerminalSessionController = async (req, res) => {
  const { session_id, language } = req.body;

  try {
    const terminalSession = await createTerminalSession(session_id, language);
    res.status(201).json(terminalSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTerminalSessionsController = async (req, res) => {
  try {
    const terminalSessions = await getTerminalSessions();
    res.status(200).json(terminalSessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTerminalSessionsByidController = async (req, res) => {
  const terminal_id = req.params.id;

  try {
    const terminalSession = await getTerminalSessionsByid(terminal_id);
    res.status(200).json(terminalSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTerminalSessionsBySessionIdController = async (req, res) => {
  const session_id = req.params.id;

  try {
    const terminalSessions = await getTerminalSessionsBySessionId(session_id);
    res.status(200).json(terminalSessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLastActiveController = async (req, res) => {
  const terminal_id = req.params.id;

  try {
    const terminalSession = await updateLastActive(terminal_id);
    res.status(200).json(terminalSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTerminalSessionController = async (req, res) => {
  const terminal_id = req.params.id;

  try {
    const terminalSession = await deleteTerminalSession(terminal_id);
    res.status(200).json(terminalSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTerminalSessionController,
  getTerminalSessionsController,
  getTerminalSessionsByidController,
  getTerminalSessionsBySessionIdController,
  updateLastActiveController,
  deleteTerminalSessionController,
};
