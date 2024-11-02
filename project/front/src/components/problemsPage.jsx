import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  User,
  BookOpen,
} from "lucide-react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Select,
  MenuItem,
  Card,
  Grid,
  alpha,
  Alert,
} from "@mui/material";
import ProblemService from "../Services/problemService";
import UserService from "../Services/userService";

const difficultyConfig = {
  easy: {
    color: "#4ade80",
    background: alpha("#4ade80", 0.1),
    label: "Easy",
  },
  medium: {
    color: "#fbbf24",
    background: alpha("#fbbf24", 0.1),
    label: "Medium",
  },
  hard: {
    color: "#f87171",
    background: alpha("#f87171", 0.1),
    label: "Hard",
  },
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch problems and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all users first
        const usersResponse = await UserService.getAllUsers();
        const users = usersResponse.data.users;

        // Create user map
        const userDataMap = {};
        users.forEach((user) => {
          userDataMap[user.user_id] = user;
        });

        // Fetch problems
        const problemsResponse = await ProblemService.getAllProblems();
        const problemsData = problemsResponse.data.problems;

        setUserMap(userDataMap);
        setProblems(problemsData);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rest of the filter and sort logic remains the same
  useEffect(() => {
    let result = [...problems];

    if (searchQuery) {
      result = result.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (difficultyFilter !== "all") {
      result = result.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
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

    setFilteredProblems(result);
  }, [searchQuery, difficultyFilter, sortBy, problems]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0a0118",
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <BookOpen size={32} className="text-purple-400" />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#FAF0CA",
              }}
            >
              Problem Bank
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              color: "#FAF0CA",
              maxWidth: "600px",
              opacity: 0.7,
            }}
          >
            Sharpen your coding skills with our carefully curated collection of
            programming challenges.
            {filteredProblems.length > 0 &&
              ` Showing ${filteredProblems.length} problem${
                filteredProblems.length !== 1 ? "s" : ""
              }.`}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Filters Section */}
        <Card
          sx={{
            mb: 4,
            bgcolor: "#3C096C",
            borderRadius: 2,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#FAF0CA" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#240046",
                    "& input": {
                      color: "#FAF0CA",
                    },
                    "& fieldset": {
                      borderColor: "#5A189A",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7B2CBF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#9D4EDD",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                sx={{
                  bgcolor: "#240046",
                  color: "#FAF0CA",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#5A189A",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7B2CBF",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9D4EDD",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#FAF0CA",
                  },
                }}
              >
                <MenuItem value="all">All Difficulties</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  bgcolor: "#240046",
                  color: "#FAF0CA",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#5A189A",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7B2CBF",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9D4EDD",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#FAF0CA",
                  },
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="difficulty">Difficulty</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Card>

        {/* Problems List */}
        <Stack spacing={2}>
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <Card
                key={problem.problem_id}
                sx={{
                  bgcolor: "#3C096C",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    bgcolor: "#5A189A",
                  },
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography
                            variant="h6"
                            sx={{ color: "#FAF0CA", fontWeight: 600 }}
                          >
                            {problem.title}
                          </Typography>
                          <Chip
                            label={difficultyConfig[problem.difficulty].label}
                            sx={{
                              color: difficultyConfig[problem.difficulty].color,
                              bgcolor:
                                difficultyConfig[problem.difficulty].background,
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{ color: "#FAF0CA", opacity: 0.8 }}
                        >
                          {problem.description}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <User size={16} sx={{ color: "#FAF0CA" }} />
                        <Typography
                          variant="caption"
                          sx={{ color: "#FAF0CA", opacity: 0.8 }}
                        >
                          {userMap[problem.created_by]?.username ||
                            "Unknown User"}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ mt: 1 }}
                      >
                        <Clock size={16} sx={{ color: "#FAF0CA" }} />
                        <Typography
                          variant="caption"
                          sx={{ color: "#FAF0CA", opacity: 0.8 }}
                        >
                          {new Date(problem.created_at).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            ))
          ) : (
            <Card
              sx={{
                bgcolor: "#3C096C",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 1 }}>
                No problems found
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#FAF0CA", opacity: 0.8 }}
              >
                Try adjusting your search or filter criteria
              </Typography>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
