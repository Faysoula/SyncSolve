import http from "../http-common";
import { getTokenBearer } from "../utils/token";

// Problem service to get, add, update, delete problems
const getAllProblems = () => {
  return http.get("/problems/getAllProblems", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Get problems by difficulty
const getProblemsByDifficulty = (difficulty) => {
  return http.get(`/problems/getProblemBYDifficulty/${difficulty}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Add a new problem
const addProblem = (data) => {
  return http.post("/problems/addProblem", data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Get a problem by id
const getProblemById = (id) => {
  return http.get(`/problems/${id}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Get all tags
const getAllTags = () => {
  return http.get("/problems/tags", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Search problems by tags
const searchByTags = (tags) => {
  const tagString = Array.isArray(tags) ? tags.join(",") : tags;
  return http.get(`/problems/searchByTags?tags=${tagString}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Update a problem
const updateProblem = (id, data) => {
  return http.put(`/problems/updateProblem/${id}`, data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Delete a problem
const deleteProblem = (id) => {
  return http.delete(`/problems/deleteProblem/${id}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
// Get daily problem
const getDailyProblem = () => {
  return http.get("/problems/daily", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const ProblemService = {
  getAllProblems,
  getProblemsByDifficulty,
  addProblem,
  getProblemById,
  getAllTags,
  searchByTags,
  updateProblem,
  deleteProblem,
  getDailyProblem,
};

export default ProblemService;
