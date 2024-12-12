const {
  addProblemController,
  getAllProblemsController,
  getProblemBYDifficultyController,
  getProblemByIdController,
  updateProblemController,
  deleteProblemController,
  searchByTagsController,
  getAllTagsController,
  getDailyProblemController,
} = require("../controllers/problemController");

const express = require("express");
const router = express.Router();

const cache = require("../middleware/cache");
const auth = require("../middleware/auth");

router.get("/Tags", getAllTagsController);
// Add a new problem
router.post("/addProblem", auth, addProblemController);

// Get a problem by ID

// Get all problems
router.get("/getAllProblems", cache(300), getAllProblemsController);

// Get problems by difficulty
router.get(
  "/getProblemBYDifficulty/:difficulty",
  getProblemBYDifficultyController
);

// Get problems by tags
router.get("/searchByTags", searchByTagsController);

// Get all tags

// Update a problem
router.put("/updateProblem/:id", auth, updateProblemController);

router.get("/daily", cache(3600), getDailyProblemController);
router.get("/:id", cache(600), getProblemByIdController);
// Delete a problem
router.delete("/deleteProblem/:id", auth, deleteProblemController);

module.exports = router;
