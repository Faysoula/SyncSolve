const Session = require("../models/session");
const User = require("../models/user");
require("dotenv").config();
const axios = require("axios");
const Execution = require("../models/executions");
const TerminalSession = require("../models/terminal_sessions");
const { getSessionById } = require("./sessionService");

const LANGUAGE_MAP = {
  Cpp: 54, // C++ (GCC 9.2.0)
  Java: 62, // Java (OpenJDK 13.0.1)
  Python: 71, // Python (3.8.1)
};

const checkSyntax = async (code, language) => {
  const languageId = LANGUAGE_MAP[language];
  console.log(
    "Checking syntax for language:",
    language,
    "with ID:",
    languageId
  );
  if (!languageId) {
    throw new Error("Unsupported language for syntax check");
  }

  try {
    // Initial submission to Judge0
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: languageId,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const { token } = response.data;
    console.log("Submission token:", token);

    // Polling loop to check the status of the submission
    const maxWaitTime = 30000; // Maximum wait time of 30 seconds
    const pollingInterval = 3000; // 3-second delay between polling requests
    const startTime = Date.now();

    let resultResponse;
    while (true) {
      // Check the elapsed time to enforce the max wait time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > maxWaitTime) {
        throw new Error("Execution timed out. Please try again later.");
      }

      // Get the submission status
      resultResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const { status } = resultResponse.data;
      console.log("Judge0 Status:", status.description);

      // If the status is not "In Queue" or "Processing", break the loop
      if (status.id !== 1 && status.id !== 2) break;

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }

    // Handle the response when completed
    const { stderr, stdout, compile_output, status } = resultResponse.data;
    if (status.id === 3) {
      // "Accepted" in Judge0
      return { valid: true, result: stdout, status: "success" };
    } else {
      return {
        valid: false,
        result: stderr || compile_output || "Syntax error",
        status: "error",
      };
    }
  } catch (error) {
    throw new Error(`Syntax check failed: ${error.message}`);
  }
};



const createExecution = async (session_id, user_id, code, terminal_id) => {
  try {
    // Retrieve the terminal session to get the language and other data
    const terminalSession = await TerminalSession.findByPk(terminal_id);
    if (!terminalSession) {
      throw new Error("Terminal session not found");
    }

    const { language } = terminalSession;

    // Perform syntax check using the language from terminal_sessions
    const syntaxCheck = await checkSyntax(code, language);
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
        { model: TerminalSession, attributes: ["terminal_id", "language", "active", "last_active"] },
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
        { model: TerminalSession, attributes: ["terminal_id", "language", "active", "last_active"] },
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
        { model: TerminalSession, attributes: ["terminal_id", "language", "active", "last_active"] },
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
        { model: TerminalSession, attributes: ["terminal_id", "language", "active", "last_active"] },
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
