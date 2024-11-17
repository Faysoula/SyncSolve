import http from "../http-common";
import { getTokenBearer } from "../utils/token";

// Constants for error handling
const ERROR_MESSAGES = {
  NO_CODE: "No code provided",
  NO_TERMINAL: "No active terminal session",
  NO_USER: "User not authenticated",
  INVALID_LANGUAGE: "Invalid programming language",
  EXECUTION_FAILED: "Code execution failed",
};

const createProblemSession = async (teamId, problemId) => {
  try {
    const existingSessions = await http.get(
      `/sessions/session/team/${teamId}`,
      {
        headers: { Authorization: getTokenBearer() },
      }
    );

    const existingSession = existingSessions.data.find(
      (session) => session.problem_id === Number(problemId) && !session.ended_at
    );

    if (existingSession) {
      return existingSession;
    }

    const response = await http.post(
      "/sessions/CreateSession",
      {
        team_id: Number(teamId),
        problem_id: Number(problemId),
      },
      {
        headers: { Authorization: getTokenBearer() },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      `Session creation failed: ${err.response?.data?.message || err.message}`
    );
  }
};

const getActiveSession = async (teamId) => {
  try {
    const response = await http.get(`/sessions/session/team/${teamId}`, {
      headers: { Authorization: getTokenBearer() },
    });
    return response.data.filter((session) => !session.ended_at);
  } catch (err) {
    throw new Error(
      `Failed to get active sessions: ${
        err.response?.data?.message || err.message
      }`
    );
  }
};

const createTerminal = async (sessionId, language) => {
  if (!sessionId || !language) {
    throw new Error(ERROR_MESSAGES.INVALID_LANGUAGE);
  }

  try {
    const response = await http.post(
      "/terminal/createTerminal",
      {
        session_id: Number(sessionId),
        language: language,
      },
      {
        headers: { Authorization: getTokenBearer() },
      }
    );

    if (!response.data) {
      throw new Error(ERROR_MESSAGES.EXECUTION_FAILED);
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    if (errorMessage.includes("language not supported")) {
      throw new Error(`${ERROR_MESSAGES.INVALID_LANGUAGE}: ${language}`);
    }
    throw new Error(`Terminal creation failed: ${errorMessage}`);
  }
};

const executeCode = async (userId, code, terminalId) => {
  if (!userId) throw new Error("User ID is required");
  if (!code?.trim()) throw new Error("Code cannot be empty");
  if (!terminalId) throw new Error("Terminal ID is required");

  try {
    const response = await http.post(
      "/executions/createEx",
      {
        user_id: Number(userId),
        code: code.trim(),
        terminal_id: Number(terminalId),
      },
      {
        headers: {
          Authorization: getTokenBearer(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("No response from execution service");
    }

    const { success, execution, runResult } = response.data;

    return {
      success: Boolean(success),
      execution: execution || null,
      runResult: {
        allPassed: runResult?.allPassed || false,
        results:
          runResult?.results?.map((result) => ({
            passed: Boolean(result.passed),
            input: result.input,
            expectedOutput: result.expectedOutput,
            output: result.output,
            error: result.error,
            status: result.status,
          })) || [],
      },
    };
  } catch (error) {
    console.error("Code execution error:", error);
    return {
      success: false,
      execution: null,
      runResult: {
        allPassed: false,
        results: [],
        error: error.response?.data?.message || error.message,
      },
    };
  }
};

const updateSession = async (sessionId, problemId) => {
  try {
    const response = await http.put(
      `/sessions/${sessionId}/updateSesh`,
      { problem_id: Number(problemId) },
      { headers: { Authorization: getTokenBearer() } }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      `Session update failed: ${err.response?.data?.message || err.message}`
    );
  }
};

const endSession = async (sessionId) => {
  try {
    const response = await http.put(
      `/sessions/${sessionId}/end`,
      {},
      { headers: { Authorization: getTokenBearer() } }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      `Failed to end session: ${err.response?.data?.message || err.message}`
    );
  }
};

const getUserTeam = async (userId) => {
  try {
    const response = await http.get(`/team-members/${userId}`, {
      headers: { Authorization: getTokenBearer() },
    });
    return response.data.teamMembers[0]?.team_id;
  } catch (err) {
    throw new Error(
      `Failed to get user team: ${err.response?.data?.message || err.message}`
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