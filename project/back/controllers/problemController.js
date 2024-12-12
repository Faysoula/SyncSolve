const {
  addProblem,
  getAllProblems,
  getProblemBYDifficulty,
  getProblemById,
  deleteProblem,
  updateProblem,
  searchProblemsByTags,
  getAllTags,
  getDailyProblem,
} = require("../services/problemsService");


// Add a new problem
const addProblemController = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    created_by,
    test_cases,
    example_images,
    tags,
  } = req.body;

  try {
    const problem = await addProblem(
      title,
      description,
      difficulty,
      created_by,
      test_cases,
      example_images,
      tags
    );
    res.status(201).json({ message: "Problem added successfully", problem });
  } catch (err) {
    console.error("Error adding problem:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// Search problems by tags
const searchByTagsController = async (req, res) => {
  const { tags } = req.query;
  try {
    const problems = await searchProblemsByTags(tags.split(","));
    res.status(200).json({ problems });
  } catch (err) {
    console.error("Error searching problems by tags:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get all tags
const getAllTagsController = async (req, res) => {
  try {
    const tags = await getAllTags();
    res.status(200).json({ tags });
  } catch (err) {
    console.error("Error getting all tags:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get all problems
const getAllProblemsController = async (req, res) => {
  console.log("⏳ Starting problems fetch...");
  console.time("Problems Fetch Duration");

  try {
    const problems = await getAllProblems();
    console.timeEnd("Problems Fetch Duration");

    console.log(`📊 Retrieved ${problems.length} problems`);
    res.status(200).json({ problems });
  } catch (err) {
    console.error("❌ Error getting all problems:", err.message);
    console.timeEnd("Problems Fetch Duration");
    res.status(500).json({ message: err.message });
  }
};

// Get problems by difficulty
const getProblemBYDifficultyController = async (req, res) => {
  const { difficulty } = req.params;
  try {
    const problems = await getProblemBYDifficulty(difficulty);
    res.status(200).json(problems);
  } catch (err) {
    console.error("Error getting problems by difficulty:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get problem by ID
const getProblemByIdController = async (req, res) => {
  const problem_id = req.params.id;
  console.time("Problem Fetch Time"); // Start timer

  try {
    const problem = await getProblemById(problem_id);
    console.timeEnd("Problem Fetch Time"); // End timer
    console.log("Database Query Executed"); // Log when database is hit
    res.status(200).json(problem);
  } catch (err) {
    console.error("Error getting problem by ID:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateProblemController = async (req, res) => {
  const problem_id = req.params.id;
  const {
    title,
    description,
    difficulty,
    test_cases,
    example_images,
    tags,
    metadata,
  } = req.body;

  try {
    const updatedProblem = await updateProblem(
      problem_id,
      title,
      description,
      difficulty,
      test_cases,
      example_images,
      tags,
      metadata
    );

    res.status(200).json({
      message: "Problem updated successfully",
      updatedProblem,
    });
  } catch (err) {
    console.error("Error updating problem:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const deleteProblemController = async (req, res) => {
  const problem_id = req.params.id;
  try {
    const message = await deleteProblem(problem_id);
    res.status(200).json(message);
  } catch (err) {
    console.error("Error deleting problem:", err.message);
    res.status(500).json({ message: err.message });
  }
};
const getDailyProblemController = async (req, res) => {
  try {
    const problem = await getDailyProblem();
    if (!problem) {
      return res.status(404).json({ message: "No daily problem available" });
    }
    res.status(200).json(problem);
  } catch (err) {
    console.error("Error getting daily problem:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addProblemController,
  getAllProblemsController,
  getProblemBYDifficultyController,
  getProblemByIdController,
  updateProblemController,
  deleteProblemController,
  searchByTagsController,
  getAllTagsController,
  getDailyProblemController,
};
