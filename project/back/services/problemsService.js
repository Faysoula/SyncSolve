const Problems = require("../models/problems");
const { getUserById } = require("./userService");
const addProblem = async (title, description, difficulty, created_by) => {
  try {
    //jst in case
    const validDifficulty = ["easy", "medium", "hard"];
    const normalizedDifficulty = difficulty.toLowerCase();

    if (!validDifficulty.includes(normalizedDifficulty)) {
      throw new Error("Invalid difficulty");
    }

    const user = await getUserById(created_by);
    if(!user){
        throw new Error("User not found");
    }

    const problem = await Problems.create({
      title,
      description,
      difficulty: normalizedDifficulty,
      created_by,
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

const updateProblem = async (problem_id, title, description, difficulty) => {
  try {
    const [affectedrows] = await Problems.update(
      {
        title,
        description,
        difficulty,
      },
      {
        where: {
          problem_id,
        },
      }
    );

    if (affectedrows === 0) {
      throw new Error("Problem not found");
    }

    const updatedProblem = await Problems.findByPk(problem_id);
    return updatedProblem;
  } catch (err) {
    throw new Error(`Error updating problem: ${err.message}`);
  }
};
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

module.exports = {
  addProblem,
  getAllProblems,
  getProblemBYDifficulty,
  deleteProblem,
  updateProblem,
};
