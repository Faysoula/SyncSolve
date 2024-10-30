const express = require("express");
const {
  createExecutionController,
  getAllExecutionsController,
  getExecutionsBySessionIdController,
  getExecutionsByUserIdController,
  getExecutionByIdController,
  updateExecutionController,
  deleteExecutionController,
} = require("../controllers/executionController");

const router = express.Router();

router.post("/createEx", createExecutionController);
router.get("/", getAllExecutionsController);
router.get("/session/:session_id", getExecutionsBySessionIdController);
router.get("/user/:user_id", getExecutionsByUserIdController);
router.get("/:execution_id", getExecutionByIdController);
router.put("/:execution_id", updateExecutionController);
router.delete("/:execution_id", deleteExecutionController);

module.exports = router;
