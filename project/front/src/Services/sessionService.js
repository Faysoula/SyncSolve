import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const createProblemSession = async (teamId, problemId) => {
  try {
    // First check if there's already an active session for this problem and team
    const existingSessions = await http.get(
      `/sessions/session/team/${teamId}`,
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );

    // Find an active session for this specific problem
    const existingSession = existingSessions.data.find(
      (session) => session.problem_id === Number(problemId) && !session.ended_at
    );

    // If we found an existing active session for this problem, return it
    if (existingSession) {
      return existingSession;
    }

    // If no existing session found, create a new one
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
    // Filter to only return active sessions (those without an ended_at date)
    const activeSessions = response.data.filter((session) => !session.ended_at);
    return activeSessions;
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

const updateSession = async (sessionId, problemId) => {
  try {
    const response = await http.put(
      `/sessions/${sessionId}/updateSesh`,
      {
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
    console.error("Session update error:", err);
    throw err;
  }
};

const endSession = async (sessionId) => {
  try {
    const response = await http.put(
      `/sessions/${sessionId}/end`,
      {},
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Session end error:", err);
    throw err;
  }
};

//terminal things

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
  updateSession,
  endSession,
  getActiveSession,
  getUserTeam,
};

export default SessionTerminalService;
