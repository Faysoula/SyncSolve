import { useState, useEffect, useMemo } from "react";
import ProblemService from "../Services/problemService";
import UserService from "../Services/userService";

const useProblemsData = () => {
  const [problems, setProblems] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    difficultyFilter: "all",
    sortBy: "newest",
  });

  // Fetch problems and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersResponse, problemsResponse] = await Promise.all([
          UserService.getAllUsers(),
          ProblemService.getAllProblems(),
        ]);

        // Create user map
        const userDataMap = usersResponse.data.users.reduce((acc, user) => {
          acc[user.user_id] = user;
          return acc;
        }, {});

        setUserMap(userDataMap);
        setProblems(problemsResponse.data.problems);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let result = [...problems];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (problem) =>
          problem.title.toLowerCase().includes(query) ||
          problem.description.toLowerCase().includes(query)
      );
    }

    // Apply difficulty filter
    if (filters.difficultyFilter !== "all") {
      result = result.filter(
        (problem) => problem.difficulty === filters.difficultyFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "title":
          return a.title.localeCompare(b.title);
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return result;
  }, [problems, filters]);

  return {
    problems,
    loading,
    error,
    filteredProblems,
    userMap,
    filters,
    setFilters,
  };
};

export default useProblemsData;
