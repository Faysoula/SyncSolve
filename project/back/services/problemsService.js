const { getUserById } = require("./userService");
const { Op } = require("sequelize");
const { db } = require("../config/db");
const Problems = require("../models/problems");
const axios = require("axios");

const addProblem = async (
  title,
  description,
  difficulty,
  created_by,
  test_cases,
  example_images = [],
  tags = []
) => {
  try {
    const validDifficulty = ["easy", "medium", "hard"];
    const normalizedDifficulty = difficulty.toLowerCase();

    if (!validDifficulty.includes(normalizedDifficulty)) {
      throw new Error("Invalid difficulty");
    }

    const user = await getUserById(created_by);
    if (!user) {
      throw new Error("User not found");
    }

    // store the filenames
    const metadata = {
      example_images: example_images.filter((img) => img !== null), //just filenames
      tags: tags
        .map((tag) => tag.toLowerCase().trim())
        .filter((tag) => tag !== ""),
    };

    const problem = await Problems.create({
      title,
      description,
      difficulty: normalizedDifficulty,
      created_by,
      test_cases,
      metadata,
    });

    return problem;
  } catch (err) {
    throw new Error(`Error adding problem: ${err.message}`);
  }
};

const getAllProblems = async () => {
  try {
    const problems = await Problems.findAll();
    return problems;
  } catch (err) {
    throw new Error(`Error getting problems: ${err.message}`);
  }
};

const getProblemBYDifficulty = async (difficulty) => {
  try {
    const problems = await Problems.findAll({
      where: {
        difficulty: difficulty,
      },
    });

    return problems;
  } catch (err) {
    throw new Error(`Error getting problems by difficulty: ${err.message}`);
  }
};

const getProblemById = async (problem_id) => {
  try {
    const problem = await Problems.findByPk(problem_id);
    if (!problem) {
      throw new Error("Problem not found");
    }
    return problem;
  } catch (err) {
    throw new Error(`Error getting problem by id: ${err.message}`);
  }
};

const updateProblem = async (
  problem_id,
  title,
  description,
  difficulty,
  test_cases,
  example_images = [],
  tags = [],
  metadata = null
) => {
  try {
    const problem = await Problems.findByPk(problem_id);
    if (!problem) {
      throw new Error("Problem not found");
    }

    let updatedMetadata;

    if (metadata) {
      // If metadata object is provided directly, use it but ensure proper structure
      updatedMetadata = {
        example_images: Array.isArray(metadata.example_images)
          ? metadata.example_images.filter((img) => img !== null)
          : problem.metadata.example_images,
        tags: Array.isArray(metadata.tags)
          ? metadata.tags
              .map((tag) => tag.toLowerCase().trim())
              .filter((tag) => tag !== "")
          : problem.metadata.tags,
      };
    } else {
      // Use individual parameters if no direct metadata object
      updatedMetadata = {
        example_images: example_images.filter((img) => img !== null),
        tags: tags
          .map((tag) => tag.toLowerCase().trim())
          .filter((tag) => tag !== ""),
      };
    }

    await problem.update({
      title: title || problem.title,
      description: description || problem.description,
      difficulty: difficulty || problem.difficulty,
      test_cases: test_cases || problem.test_cases,
      metadata: updatedMetadata,
    });

    return problem;
  } catch (err) {
    throw new Error(`Error updating problem: ${err.message}`);
  }
};

const getAllTags = async () => {
  try {
    const problems = await Problems.findAll({
      where: {
        metadata: {
          tags: {
            [Op.ne]: null,
          },
        },
      },
      attributes: ["metadata"],
    });
    const tags = new Set();
    problems.forEach((problem) => {
      const metadata = problem.metadata;
      if (metadata && Array.isArray(metadata.tags)) {
        metadata.tags.forEach((tag) => tags.add(tag.toLowerCase().trim()));
      }
    });
    return Array.from(tags);
  } catch (err) {
    throw new Error(`Error getting all tags: ${err.message}`);
  }
};
const searchProblemsByTags = async (tags) => {
  try {
    const normalizedTags = tags.map((tag) => tag.toLowerCase().trim());

    const problems = await Problems.findAll({
      where: db.literal(
        `metadata->'tags' ?& array[${normalizedTags
          .map((tag) => `'${tag}'`)
          .join(", ")}]`
      ),
      order: [["created_at", "DESC"]],
    });

    return problems;
  } catch (err) {
    console.error("Database error in searchProblemsByTags:", err);
    throw new Error(`Error searching problems by tags: ${err.message}`);
  }
};

//i may use this later
// // Helper function to add tags to a problem
// const addTagsToProblem = async (problemId, tags) => {
//   try {
//     const problem = await Problems.findByPk(problemId);
//     if (!problem) {
//       throw new Error("Problem not found");
//     }

//     const currentMetadata = problem.metadata || { tags: [] };
//     const updatedTags = [...new Set([...currentMetadata.tags, ...tags])];

//     await problem.update({
//       metadata: {
//         ...currentMetadata,
//         tags: updatedTags,
//       },
//     });

//     return problem;
//   } catch (err) {
//     throw new Error(`Error adding tags to problem: ${err.message}`);
//   }
// };

const deleteProblem = async (problem_id) => {
  try {
    const toDelete = await Problems.findByPk(problem_id);
    if (!toDelete) {
      throw new Error("Problem not found");
    }
    await toDelete.destroy();
    return { message: "Problem deleted successfully" };
  } catch (err) {
    throw new Error(`Error deleting problem: ${err.message}`);
  }
};

//daily stuff
const getDailyProblem = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First check for existing daily problem
    const existingProblem = await Problems.findOne({
      where: {
        metadata: {
          is_daily: true,
        },
        created_at: {
          [Op.gte]: today,
        },
      },
    });

    if (existingProblem) {
      return existingProblem;
    }

    // Fetch new daily problem from LeetCode API
    const response = await axios.get(
      "https://alfa-leetcode-api.onrender.com/dailyQuestion"
    );

    // The actual problem data is nested in the response
    const dailyData =
      response.data?.data?.activeDailyCodingChallengeQuestion?.question;
    if (!dailyData) {
      throw new Error("Invalid response from LeetCode API");
    }

    // Convert HTML content to plain text
    const stripHtml = (html) => {
      return html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/&quot;/g, '"') // Replace HTML entities
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/\n\n/g, "\n") // Clean up multiple newlines
        .trim();
    };

    // Parse example test cases from the exampleTestcases string
    const parseTestCases = (exampleTests) => {
      try {
        const tests = exampleTests.split("\n").filter(Boolean);
        return tests.map((test) => ({
          input: test,
          expected_output: test, // Since the API doesn't provide expected output, we'll use same for now
        }));
      } catch (err) {
        console.error("Error parsing test cases:", err);
        return [];
      }
    };

    // Create new problem in database
    const newProblem = await Problems.create({
      title: dailyData.title,
      description: stripHtml(dailyData.content), // Clean HTML from content
      difficulty: dailyData.difficulty.toLowerCase(),
      created_by: 1, // System user ID
      test_cases: parseTestCases(dailyData.exampleTestcases),
      metadata: {
        is_daily: true,
        tags: dailyData.topicTags.map((tag) => tag.name.toLowerCase()),
        leetcode_id: dailyData.questionId,
        example_images: [],
      },
    });

    return newProblem;
  } catch (err) {
    console.error("Error fetching daily problem:", err);
    throw new Error(`Error getting daily problem: ${err.message}`);
  }
};
module.exports = {
  addProblem,
  getAllProblems,
  getProblemBYDifficulty,
  getProblemById,
  deleteProblem,
  updateProblem,
  searchProblemsByTags,
  getAllTags,
  getDailyProblem,
};
