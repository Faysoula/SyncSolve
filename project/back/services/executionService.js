const Session = require("../models/session");
const User = require("../models/user");
require("dotenv").config();
const Execution = require("../models/executions");
const TerminalSession = require("../models/terminal_sessions");
const judge = require("../utils/judge");


const createExecution = async (session_id, user_id, code, terminal_id) => {
  try {
    // Retrieve the terminal session to get the language and other data
    const terminalSession = await TerminalSession.findByPk(terminal_id);
    if (!terminalSession) {
      throw new Error("Terminal session not found");
    }

    const { language } = terminalSession;

    // Perform syntax check using the language from terminal_sessions
    const syntaxCheck = await judge(code, language);
    if (!syntaxCheck.valid) {
      throw new Error(`Syntax error in code: ${syntaxCheck.result}`);
    }

    // Proceed with execution creation if syntax is valid
    const execution = await Execution.create({
      session_id,
      user_id,
      code,
      terminal_id,
      result: syntaxCheck.result,
      status: syntaxCheck.status,
    });

    return execution;
  } catch (error) {
    throw new Error(`Error creating execution: ${error.message}`);
  }
};

// 2. Get all executions
const getAllExecutions = async () => {
  try {
    const executions = await Execution.findAll({
      include: [
        { model: Session, attributes: ["session_id"] },
        { model: User, attributes: ["user_id", "username"] },
        {
          model: TerminalSession,
          attributes: ["terminal_id", "language", "active", "last_active"],
        },
      ],
    });
    return executions;
  } catch (error) {
    throw new Error(`Error retrieving executions: ${error.message}`);
  }
};

// 3. Get executions by session ID
const getExecutionsBySessionId = async (session_id) => {
  try {
    const executions = await Execution.findAll({
      where: { session_id },
      include: [
        { model: Session, attributes: ["session_id"] },
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
      `Error retrieving executions for session ${session_id}: ${error.message}`
    );
  }
};

// 4. Get executions by user ID
const getExecutionsByUserId = async (user_id) => {
  try {
    const executions = await Execution.findAll({
      where: { user_id },
      include: [
        { model: Session, attributes: ["session_id"] },
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

// 5. Get a specific execution by execution ID
const getExecutionById = async (execution_id) => {
  try {
    const execution = await Execution.findByPk(execution_id, {
      include: [
        { model: Session, attributes: ["session_id"] },
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

// 6. Update an execution
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

// 7. Delete an execution
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
