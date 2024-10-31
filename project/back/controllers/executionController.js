const {
  createExecution,
  getAllExecutions,
  getExecutionsBySessionId,
  getExecutionsByUserId,
  getExecutionById,
  updateExecution,
  deleteExecution,
} = require("../services/executionService");

const createExecutionController = async (req, res) => {
  const { user_id, code, terminal_id } = req.body;
  try {
    const execution = await createExecution(
      user_id,
      code,
      terminal_id
    );
    res.status(201).json(execution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllExecutionsController = async (req, res) => {
  try {
    const executions = await getAllExecutions();
    res.status(200).json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExecutionsBySessionIdController = async (req, res) => {
  const { session_id } = req.params;
  try {
    const executions = await getExecutionsBySessionId(session_id);
    res.status(200).json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExecutionsByUserIdController = async (req, res) => {
  const { user_id } = req.params;
  try {
    const executions = await getExecutionsByUserId(user_id);
    res.status(200).json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExecutionByIdController = async (req, res) => {
  const { execution_id } = req.params;
  try {
    const execution = await getExecutionById(execution_id);
    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }
    res.status(200).json(execution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExecutionController = async (req, res) => {
  const { execution_id } = req.params;
  const updates = req.body;
  try {
    const execution = await updateExecution(execution_id, updates);
    res.status(200).json(execution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteExecutionController = async (req, res) => {
  const { execution_id } = req.params;
  try {
    const result = await deleteExecution(execution_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExecutionController,
  getAllExecutionsController,
  getExecutionsBySessionIdController,
  getExecutionsByUserIdController,
  getExecutionByIdController,
  updateExecutionController,
  deleteExecutionController,
};
