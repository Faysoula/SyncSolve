import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const getAllProblems = () => {
  return http.get("/problems/getAllProblems", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getProblemsByDifficulty = (difficulty) => {
  return http.get(`/problems/getProblemBYDifficulty/${difficulty}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const addProblem = (data) => {
  return http.post("/problems/addProblem", data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getProblemById = (id) => {
  return http.get(`/problems/${id}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getAllTags = () => {
  return http.get("/problems/tags", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const searchByTags = (tags) => {
  const tagString = Array.isArray(tags) ? tags.join(",") : tags;
  return http.get(`/problems/searchByTags?tags=${tagString}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const updateProblem = (id, data) => {
  return http.put(`/problems/updateProblem/${id}`, data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const deleteProblem = (id) => {
  return http.delete(`/problems/deleteProblem/${id}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};
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
