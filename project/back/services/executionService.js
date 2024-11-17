const User = require("../models/user");
const Session = require("../models/session");
require("dotenv").config();
const Execution = require("../models/executions");
const TerminalSession = require("../models/terminal_sessions");
const judge = require("../utils/judge");
const { createSessionSnapshot } = require("../services/sessionSnapshotService");
const { getTeamMembers } = require("../services/teamService");
const { getProblemById } = require("../services/problemsService");

const createExecution = async (user_id, code, terminal_id) => {
  try {
    // Get terminal session
    const terminalSession = await TerminalSession.findByPk(terminal_id);
    if (!terminalSession) {
      throw new Error("Terminal session not found");
    }

    // Get session and problem
    const session = await Session.findByPk(terminalSession.session_id, {
      include: [
        {
          model: require("../models/problems"),
          attributes: ["test_cases"],
        },
      ],
    });

    if (!session || !session.Problem) {
      throw new Error("Session or problem not found");
    }

    const testCases = session.Problem.test_cases;
    if (!testCases || !Array.isArray(testCases)) {
      throw new Error("Invalid test cases");
    }

    // Execute code
    const runResult = await judge.checkTestCases(
      code,
      terminalSession.language,
      testCases
    );

    // Create execution record
    const execution = await Execution.create({
      user_id,
      code,
      terminal_id,
      result: JSON.stringify(runResult),
      status: runResult.allPassed ? "success" : "error",
    });

    // Save snapshot
    await createSessionSnapshot(terminalSession.session_id, code);

    return {
      success: true,
      execution: {
        execution_id: execution.execution_id,
        status: execution.status,
      },
      runResult: {
        allPassed: runResult.allPassed,
        results: runResult.results.map((result) => ({
          passed: result.passed,
          input: result.input,
          expectedOutput: result.expectedOutput,
          output: result.output,
          error: result.error,
          status: result.status,
        })),
      },
    };
  } catch (error) {
    console.error("Execution error:", error);
    throw new Error(`Execution failed: ${error.message}`);
  }
};

const getAllExecutions = async () => {
  try {
    const executions = await Execution.findAll({
      include: [
        { model: User, attributes: ["user_id", "username"] },
        {
          model: TerminalSession,
          attributes: [
            "terminal_id",
            "language",
            "active",
            "last_active",
            "session_id",
          ],
        },
      ],
    });
    return executions;
  } catch (error) {
    throw new Error(`Error retrieving executions: ${error.message}`);
  }
};

const getExecutionsBySessionId = async (session_id) => {
  try {
    const executions = await Execution.findAll({
      where: { session_id },
      include: [
        { model: User, attributes: ["user_id", "username"] },
        {
          model: TerminalSession,
          where: { session_id },
          attributes: ["terminal_id", "language", "active", "last_active"],
        },
      ],
    });
    return executions;
  } catch (error) {
    throw new Error(
      `Error retrieving executions for session ${session_id}: ${error.message}`
    );
  }
};

const getExecutionsByUserId = async (user_id) => {
  try {
    const executions = await Execution.findAll({
      where: { user_id },
      include: [
        { model: User, attributes: ["user_id", "username"] },
        {
          model: TerminalSession,
          attributes: ["terminal_id", "language", "active", "last_active"],
        },
      ],
    });
    return executions;
  } catch (error) {
    throw new Error(
      `Error retrieving executions for user ${user_id}: ${error.message}`
    );
  }
};

const getExecutionById = async (execution_id) => {
  try {
    const execution = await Execution.findByPk(execution_id, {
      include: [
        { model: User, attributes: ["user_id", "username"] },
        {
          model: TerminalSession,
          attributes: ["terminal_id", "language", "active", "last_active"],
        },
      ],
    });
    return execution;
  } catch (error) {
    throw new Error(
      `Error retrieving execution ${execution_id}: ${error.message}`
    );
  }
};

const updateExecution = async (execution_id, updates) => {
  try {
    const execution = await Execution.findByPk(execution_id);
    if (!execution) {
      throw new Error("Execution not found");
    }
    await execution.update(updates);
    return execution;
  } catch (error) {
    throw new Error(
      `Error updating execution ${execution_id}: ${error.message}`
    );
  }
};

const deleteExecution = async (execution_id) => {
  try {
    const execution = await Execution.findByPk(execution_id);
    if (!execution) {
      throw new Error("Execution not found");
    }
    await execution.destroy();
    return { message: "Execution deleted successfully" };
  } catch (error) {
    throw new Error(
      `Error deleting execution ${execution_id}: ${error.message}`
    );
  }
};

module.exports = {
  createExecution,
  getAllExecutions,
  getExecutionsBySessionId,
  getExecutionsByUserId,
  getExecutionById,
  updateExecution,
  deleteExecution,
};
