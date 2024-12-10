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
    difficulty: "all",
    sort: "newest",
    tags: [],
  });

  // Fetch problems and user data
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, problemsResponse, dailyProblemResponse] =
        await Promise.all([
          UserService.getAllUsers(),
          ProblemService.getAllProblems(),
          ProblemService.getDailyProblem().catch(() => null), // Handle failure gracefully
        ]);

      const userDataMap = usersResponse.data.users.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});

      setUserMap(userDataMap);

      let allProblems = problemsResponse.data.problems || [];

      // Filter out any existing daily problems
      allProblems = allProblems.filter((p) => !p.metadata?.is_daily);

      // Add new daily problem at the start if it exists
      if (dailyProblemResponse?.data) {
        allProblems.unshift(dailyProblemResponse.data);
      }

      setProblems(allProblems);
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
    return problems
      .filter((problem) => {
        // Filter by search query
        const matchesSearch =
          !filters.searchQuery || // if no search query, show all
          problem.title
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          problem.description
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase());

        // Filter by difficulty
        const matchesDifficulty =
          filters.difficulty === "all" ||
          problem.difficulty === filters.difficulty;

        // Filter by tags
        const matchesTags =
          !filters.tags?.length || // if no tags selected, show all
          (problem.metadata?.tags &&
            filters.tags.every((tag) => problem.metadata.tags.includes(tag)));

        return matchesSearch && matchesDifficulty && matchesTags;
      })
      .sort((a, b) => {
        // Sort logic
        if (filters.sort === "newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (filters.sort === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
        }
        return 0;
      });
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
