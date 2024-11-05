import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const createProblemSession = async (userId, problemId) => {
  try {
    console.log("Creating session with:", { userId, problemId }); // Debug log
    const response = await http.post(
      "/sessions/CreateSession",
      {
        team_id: Number(userId), // Ensure it's a number
        problem_id: Number(problemId), // Ensure it's a number
      },
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    console.log("Session creation response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Full error object:", err);
    console.error("Error response data:", err.response?.data);
    throw new Error(
      `Failed to create session: ${err.response?.data?.message || err.message}`
    );
  }
};

const createTerminal = async (sessionId, language) => {
  try {
    console.log("Creating terminal with:", { sessionId, language }); // Debug log
    const response = await http.post(
      "/terminal/createTerminal",
      {
        session_id: Number(sessionId), // Ensure it's a number
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
        user_id: Number(userId), // Ensure it's a number
        code: code,
        terminal_id: Number(terminalId), // Ensure it's a number
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
};

export default SessionTerminalService;
