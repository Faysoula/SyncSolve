import React from "react";
import { Stack, Card, Box, Typography, Chip, IconButton } from "@mui/material";
import { User, Clock, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { difficultyConfig } from "../../utils/constants";

const ProblemsList = ({ problems, userMap }) => (
  <Stack spacing={2}>
    {problems.length > 0 ? (
      problems.map((problem) => (
        <ProblemCard
          key={problem.problem_id}
          problem={problem}
          username={userMap[problem.created_by]?.username}
        />
      ))
    ) : (
      <EmptyState />
    )}
  </Stack>
);

const ProblemCard = ({ problem, username }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCreator = user?.user_id === problem.created_by;

  return (
    <Card sx={styles.problemCard}>
      <Box sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Box sx={{ flex: { xs: "1", md: "3" } }}>
            <Stack spacing={2}>
              <Stack spacing={2}>
                {/* Title and Difficulty */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
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

                  {isCreator && (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Navigating to edit:", problem.problem_id);
                        navigate(`/problems/edit/${problem.problem_id}`, {
                          state: { problem },
                          replace: true,
                        });
                      }}
                      sx={{
                        color: "#FAF0CA",
                        "&:hover": {
                          bgcolor: "rgba(250, 240, 202, 0.1)",
                        },
                      }}
                    >
                      <Edit size={20} />
                    </IconButton>
                  )}
                </Stack>

                {/* Tags Section */}
                <Box>
                  {problem.metadata?.tags &&
                  problem.metadata.tags.length > 0 ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {problem.metadata.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(157, 78, 221, 0.1)",
                            color: "#9D4EDD",
                            borderColor: "#9D4EDD",
                            "&:hover": {
                              bgcolor: "rgba(157, 78, 221, 0.2)",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9D4EDD",
                        fontStyle: "italic",
                        opacity: 0.8,
                      }}
                    >
                      no tags here you're on your own :/
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Typography
                variant="body2"
                sx={{ color: "#FAF0CA", opacity: 0.8 }}
              >
                {problem.description}
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: { xs: "1", md: "1" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: "flex-start",
              mt: { xs: 2, md: 0 },
            }}
          >
            <ProblemMetadata username={username} date={problem.created_at} />
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

const ProblemMetadata = ({ username, date }) => (
  <Stack spacing={1} sx={{ width: "100%" }}>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent={{ xs: "flex-start", md: "flex-end" }}
    >
      <User size={16} sx={{ color: "#FAF0CA" }} />
      <Typography variant="caption" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
        {username || "Unknown User"}
      </Typography>
    </Stack>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent={{ xs: "flex-start", md: "flex-end" }}
    >
      <Clock size={16} sx={{ color: "#FAF0CA" }} />
      <Typography variant="caption" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
        {new Date(date).toLocaleDateString()}
      </Typography>
    </Stack>
  </Stack>
);

const EmptyState = () => (
  <Card sx={styles.emptyState}>
    <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 1 }}>
      No problems found
    </Typography>
    <Typography variant="body2" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
      Try adjusting your search or filter criteria
    </Typography>
  </Card>
);

const styles = {
  problemCard: {
    bgcolor: "#3C096C",
    borderRadius: 2,
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-2px)",
      bgcolor: "#5A189A",
    },
  },
  emptyState: {
    bgcolor: "#3C096C",
    borderRadius: 2,
    p: 4,
    textAlign: "center",
  },
};

export default ProblemsList;