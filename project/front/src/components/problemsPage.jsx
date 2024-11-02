import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  Clock,
  Award,
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
  IconButton,
  Card,
  Divider,
  Grid,
  alpha,
} from "@mui/material";

const difficultyConfig = {
  easy: {
    color: "#22c55e",
    background: alpha("#22c55e", 0.1),
    label: "Easy",
  },
  medium: {
    color: "#eab308",
    background: alpha("#eab308", 0.1),
    label: "Medium",
  },
  hard: {
    color: "#ef4444",
    background: alpha("#ef4444", 0.1),
    label: "Hard",
  },
};

// In a real application, this would come from your API
const mockProblems = [
  {
    problem_id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    created_at: "2024-03-15",
    created_by: "John Doe",
    solved_count: 1234,
    acceptance_rate: 76,
  },
  {
    problem_id: 2,
    title: "Merge K Sorted Lists",
    description:
      "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    difficulty: "hard",
    created_at: "2024-03-14",
    created_by: "Jane Smith",
    solved_count: 892,
    acceptance_rate: 45,
  },
  {
    problem_id: 3,
    title: "LRU Cache",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    difficulty: "medium",
    created_at: "2024-03-13",
    created_by: "Alex Johnson",
    solved_count: 567,
    acceptance_rate: 62,
  },
  {
    problem_id: 4,
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    created_at: "2024-03-12",
    created_by: "Sarah Wilson",
    solved_count: 2341,
    acceptance_rate: 82,
  },
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState(mockProblems);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProblems, setFilteredProblems] = useState(problems);

  // Apply filters and sorting whenever any filter/sort criteria changes
  useEffect(() => {
    let result = [...problems];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "acceptance":
          return b.acceptance_rate - a.acceptance_rate;
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    setFilteredProblems(result);
  }, [searchQuery, difficultyFilter, sortBy, problems]);

  // Debounced search handler
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

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
                background: "linear-gradient(to right, #c084fc, #818cf8)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Problem Bank
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              color: "gray.400",
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

        {/* Filters Section */}
        <Card
          sx={{
            mb: 4,
            bgcolor: "#1a103c",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "rgba(139, 92, 246, 0.1)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-purple-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#2d1f5b",
                    "&:hover fieldset": {
                      borderColor: "rgba(139, 92, 246, 0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
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
                startAdornment={
                  <InputAdornment position="start">
                    <Award className="text-purple-400" />
                  </InputAdornment>
                }
                sx={{
                  bgcolor: "#2d1f5b",
                  "&:hover": {
                    bgcolor: "#372963",
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
                startAdornment={
                  <InputAdornment position="start">
                    <ArrowUpDown className="text-purple-400" />
                  </InputAdornment>
                }
                sx={{
                  bgcolor: "#2d1f5b",
                  "&:hover": {
                    bgcolor: "#372963",
                  },
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="acceptance">Acceptance Rate</MenuItem>
                <MenuItem value="difficulty">Difficulty</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "#2d1f5b",
                  "&:hover": {
                    bgcolor: "#372963",
                  },
                }}
              >
                <SlidersHorizontal className="text-purple-400" />
              </IconButton>
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
                  bgcolor: "#1a103c",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "rgba(139, 92, 246, 0.1)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    borderColor: "rgba(139, 92, 246, 0.2)",
                  },
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography
                            variant="h6"
                            sx={{ color: "#e2e8f0", fontWeight: 600 }}
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
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          {problem.description}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack
                        direction="row"
                        spacing={3}
                        justifyContent="flex-end"
                        divider={
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }}
                          />
                        }
                      >
                        <Stack alignItems="center">
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", mb: 0.5 }}
                          >
                            Acceptance
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ color: "#e2e8f0", fontWeight: 600 }}
                          >
                            {problem.acceptance_rate}%
                          </Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", mb: 0.5 }}
                          >
                            Solved
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ color: "#e2e8f0", fontWeight: 600 }}
                          >
                            {problem.solved_count.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider
                        sx={{ my: 2, borderColor: "rgba(148, 163, 184, 0.1)" }}
                      />
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <User size={16} className="text-purple-400" />
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          {problem.created_by}
                        </Typography>
                        <Clock size={16} className="text-purple-400" />
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
                bgcolor: "#1a103c",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "rgba(139, 92, 246, 0.1)",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "#e2e8f0", mb: 1 }}>
                No problems found
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Try adjusting your search or filter criteria
              </Typography>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
