const {
  addProblemController,
  getAllProblemsController,
  getProblemBYDifficultyController,
  updateProblemController,
  deleteProblemController,
} = require("../controllers/problemController");

const express = require("express");
const router = express.Router();

// Add a new problem
router.post("/addProblem", addProblemController);

// Get all problems
router.get("/getAllProblems", getAllProblemsController);

// Get problems by difficulty
router.get("/getProblemBYDifficulty/:difficulty", getProblemBYDifficultyController);

// Update a problem
router.put("/updateProblem/:id", updateProblemController);

// Delete a problem
router.delete("/deleteProblem/:id", deleteProblemController);

module.exports = router;
