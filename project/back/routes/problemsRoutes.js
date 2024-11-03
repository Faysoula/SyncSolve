const {
  addProblemController,
  getAllProblemsController,
  getProblemBYDifficultyController,
  updateProblemController,
  deleteProblemController,
  searchByTagsController,
  getAllTagsController,
} = require("../controllers/problemController");

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

router.get("/Tags", getAllTagsController);
// Add a new problem
router.post("/addProblem", auth ,addProblemController);

// Get all problems
router.get("/getAllProblems", getAllProblemsController);

// Get problems by difficulty
router.get("/getProblemBYDifficulty/:difficulty", getProblemBYDifficultyController);

// Get problems by tags
router.get("/searchByTags", searchByTagsController);

// Get all tags

// Update a problem
router.put("/updateProblem/:id", auth, updateProblemController);

// Delete a problem
router.delete("/deleteProblem/:id", auth, deleteProblemController);



module.exports = router;
