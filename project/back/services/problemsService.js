const { getUserById } = require("./userService");
const { Op } = require("sequelize");
const { db } = require("../config/db");
const Problems = require("../models/problems");
const axios = require("axios");

// addProblem function to add a new problem to the database with the provided details
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
    await CacheService.clearProblemsCache();

    return problem;
  } catch (err) {
    throw new Error(`Error adding problem: ${err.message}`);
  }
};

// getAllProblems function to get all problems from the database
const getAllProblems = async () => {
  try {
    const problems = await Problems.findAll();
    return problems;
  } catch (err) {
    throw new Error(`Error getting problems: ${err.message}`);
  }
};

// getProblemBYDifficulty function to get all problems from the database by difficulty
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

// updateProblem function to update an existing problem in the database with the provided details
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
    await CacheService.clearProblemCache(problem_id);

    await CacheService.clearProblemsCache();
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
    await CacheService.clearProblemCache(problem_id);
    await CacheService.clearProblemsCache();
    return { message: "Problem deleted successfully" };
  } catch (err) {
    throw new Error(`Error deleting problem: ${err.message}`);
  }
};

//daily stuff
/**
 * Fetches or retrieves the daily programming problem
 * First checks for an existing daily problem, if none exists, fetches a new one from LeetCode API
 * 
 * @async
 * @function getDailyProblem
 * @returns {Promise<Problem>} A problem object with daily challenge properties
 * @throws {Error} If there's an issue fetching or creating the daily problem
 */
const getDailyProblem = async () => {
  try {
    // Set today's date to midnight for accurate daily comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reset is_daily flag for all previous daily problems
    await Problems.update(
      {
        metadata: db.literal(`
          jsonb_set(metadata::jsonb, '{is_daily}', 'false'::jsonb, true)
        `),
      },
      {
        where: {
          metadata: {
            is_daily: true,
          },
          created_at: {
            [Op.lt]: today,
          },
        },
      }
    );

    // Check if we already have a daily problem for today
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

    // Return existing problem if found
    if (existingProblem) {
      return existingProblem;
    }

    // Fetch new problem from LeetCode API if no existing problem found
    const response = await axios.get(
      "https://alfa-leetcode-api.onrender.com/dailyQuestion"
    );

    // Extract problem data from nested response structure
    const dailyData =
      response.data?.data?.activeDailyCodingChallengeQuestion?.question;
    if (!dailyData) {
      throw new Error("Invalid response from LeetCode API");
    }

    /**
     * Removes HTML tags and converts HTML entities to plain text
     * @param {string} html - HTML string to be cleaned
     * @returns {string} Cleaned plain text
     */
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

    /**
     * Parses example test cases from string format
     * @param {string} exampleTests - Raw test cases string
     * @returns {Array<Object>} Array of test case objects with input and expected output
     */
    const parseTestCases = (exampleTests) => {
      try {
        const tests = exampleTests.split("\n").filter(Boolean);
        return tests.map((test) => ({
          input: test,
          expected_output: test, // Using input as output since API doesn't provide expected output
        }));
      } catch (err) {
        console.error("Error parsing test cases:", err);
        return [];
      }
    };

    // Create new daily problem in database with processed data
    const newProblem = await Problems.create({
      title: dailyData.title,
      description: stripHtml(dailyData.content),
      difficulty: dailyData.difficulty.toLowerCase(),
      created_by: 1, // System user ID for daily problems
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
