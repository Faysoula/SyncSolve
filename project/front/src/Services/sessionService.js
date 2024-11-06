import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const createProblemSession = async (teamId, problemId) => {
  try {
    const response = await http.post(
      "/sessions/CreateSession",
      {
        team_id: Number(teamId),
        problem_id: Number(problemId),
      },
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Session creation error:", err);
    throw err;
  }
};

const getActiveSession = async (teamId) => {
  try {
    const response = await http.get(`/sessions/session/team/${teamId}`, {
      headers: {
        Authorization: getTokenBearer(),
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error getting active session:", err);
    throw err;
  }
};

const getUserTeam = async (userId) => {
  try {
    const response = await http.get(`/team-members/${userId}`, {
      headers: {
        Authorization: getTokenBearer(),
      },
    });
    return response.data.teamMembers[0]?.team_id;
  } catch (err) {
    console.error("Error getting user team:", err);
    throw err;
  }
};

const createTerminal = async (sessionId, language) => {
  try {
    console.log("Creating terminal with:", { sessionId, language }); // Debug log
    const response = await http.post(
      "/terminal/createTerminal",
      {
        session_id: Number(sessionId),
        language: language,
      },
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    console.log("Terminal creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error response data:", error.response?.data);
    throw new Error(
      `Failed to create terminal: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

const executeCode = async (userId, code, terminalId) => {
  try {
    console.log("Executing code with:", { userId, terminalId }); // Debug log
    const response = await http.post(
      "/executions/createEx",
      {
        user_id: Number(userId),
        code: code,
        terminal_id: Number(terminalId),
      },
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    console.log("Code execution response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error response data:", error.response?.data);
    throw new Error(
      `Failed to execute code: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};


const SessionTerminalService = {
  createProblemSession,
  createTerminal,
  executeCode,
  getActiveSession,
  getUserTeam,
};

export default SessionTerminalService;
