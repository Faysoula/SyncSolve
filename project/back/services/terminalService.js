const TerminalSession = require("../models/terminal_sessions");
const { getSessionById } = require("./sessionService");
const Session = require("../models/session");

const SUPPORTED_LANGUAGES = ["Cpp", "Java", "Python"];

// Create a new terminal session
const createTerminalSession = async (session_id, language) => {
  try {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error("Language not supported");
    }
    const session = await getSessionById(session_id);
    if (!session) {
      throw new Error("Session not found");
    }

    const terminalSession = await TerminalSession.create({
      session_id,
      language,
    });
    return terminalSession;
  } catch (error) {
    throw new Error(`Error creating terminal session: ${error.message}`);
  }
};

// Retrieve all terminal sessions
const getTerminalSessions = async () => {
  try {
    const terminalSessions = await TerminalSession.findAll({
      include: [
        {
          model: Session,
          attributes: ["session_id"],
        },
      ],
    });
    return terminalSessions;
  } catch (error) {
    throw new Error(`Error retrieving terminal sessions: ${error.message}`);
  }
};

// Retrieve a terminal session by its ID
const getTerminalSessionsByid = async (terminal_id) => {
  try {
    // Include session details
    const terminalSession = await TerminalSession.findByPk(terminal_id, {
      include: [
        {
          model: Session,
          attributes: ["session_id"],
        },
      ],
    });
    return terminalSession;
  } catch (error) {
    throw new Error(`Error retrieving terminal session: ${error.message}`);
  }
};

// Retrieve all terminal sessions for a specific session
const getTerminalSessionsBySessionId = async (session_id) => {
  try {
    // Include session details
    const terminalSessions = await TerminalSession.findAll({
      where: {
        session_id,
      },
      // Include session details
      include: [
        {
          model: Session,
          attributes: ["session_id"],
        },
      ],
    });
    return terminalSessions;
  } catch (error) {
    throw new Error(`Error retrieving terminal sessions: ${error.message}`);
  }
};

//  Update the last active time for a terminal session
const updateLastActive = async (terminal_id) => {
  try {
    const terminalSession = await TerminalSession.findByPk(terminal_id);
    if (!terminalSession) {
      throw new Error("Terminal session not found");
    }

    terminalSession.last_active = new Date();
    await terminalSession.save();
    return terminalSession;
  } catch (error) {
    throw new Error(`Error updating last active: ${error.message}`);
  }
};

// End a terminal session
const deleteTerminalSession = async (terminal_id) => {
  try {
    const terminalSession = await TerminalSession.findByPk(terminal_id);
    if (!terminalSession) {
      throw new Error("Terminal session not found");
    }

    terminalSession.destroy();
    return { message: "Terminal session ended" };
  } catch (error) {
    throw new Error(`Error ending terminal session: ${error.message}`);
  }
};

module.exports = {
  createTerminalSession,
  getTerminalSessions,
  getTerminalSessionsByid,
  getTerminalSessionsBySessionId,
  updateLastActive,
  deleteTerminalSession,
};
