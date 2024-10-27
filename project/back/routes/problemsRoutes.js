const {
  addProblemController,
  getAllProblemsController,
  getProblemBYDifficultyController,
  updateProblemController,
  deleteProblemController,
} = require("../controllers/problemController");

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

// Add a new problem
router.post("/addProblem", auth ,addProblemController);

// Get all problems
router.get("/getAllProblems", getAllProblemsController);

// Get problems by difficulty
router.get("/getProblemBYDifficulty/:difficulty", getProblemBYDifficultyController);

// Update a problem
router.put("/updateProblem/:id", auth, updateProblemController);

// Delete a problem
router.delete("/deleteProblem/:id", auth, deleteProblemController);

module.exports = router;
