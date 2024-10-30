const TerminalSession = require("../models/terminal_sessions");
const { getSessionById } = require("./sessionService");
const Session = require("../models/session");

const SUPPORTED_LANGUAGES = ["Cpp", "Java", "Python"];

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

const getTerminalSessionsByid = async (terminal_id) => {
  try {
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

const getTerminalSessionsBySessionId = async (session_id) => {
  try {
    const terminalSessions = await TerminalSession.findAll({
      where: {
        session_id,
      },
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
