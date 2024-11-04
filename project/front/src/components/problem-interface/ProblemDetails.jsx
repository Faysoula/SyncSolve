import React from "react";
import { Box, Card, Chip, Typography, Stack } from "@mui/material";
import { Clock } from "lucide-react";
import ProblemImage from "../problem-common/ProblemImage";

const ProblemDetails = ({ problem }) => {
  if (!problem) return null;

  return (
    <Card
      sx={{
        width: { xs: "100%", md: "50%" },
        bgcolor: "#3C096C",
        p: 4,
        height: "fit-content",
      }}
    >
      <Stack spacing={4}>
        {/* Problem Header */}
        <Box>
          <Typography
            variant="h4"
            sx={{ color: "#FAF0CA", fontWeight: 700, mb: 2 }}
          >
            {problem.title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Chip
              label={problem.difficulty}
              sx={{
                bgcolor:
                  problem.difficulty === "easy"
                    ? "rgba(74, 222, 128, 0.2)"
                    : problem.difficulty === "medium"
                    ? "rgba(251, 191, 36, 0.2)"
                    : "rgba(248, 113, 113, 0.2)",
                color:
                  problem.difficulty === "easy"
                    ? "#4ade80"
                    : problem.difficulty === "medium"
                    ? "#fbbf24"
                    : "#f87171",
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Clock size={16} style={{ color: "#FAF0CA" }} />
              <Typography
                variant="body2"
                sx={{ color: "#FAF0CA", opacity: 0.8 }}
              >
                {new Date(problem.created_at).toLocaleDateString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Tags */}
        <Box>
          <Typography variant="subtitle1" sx={{ color: "#FAF0CA", mb: 2 }}>
            Topics
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {problem.metadata?.tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: "rgba(157, 78, 221, 0.2)",
                  color: "#9D4EDD",
                  border: "1px solid #9D4EDD",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Problem Description */}
        <Box>
          <Typography
            variant="body1"
            sx={{
              color: "#FAF0CA",
              whiteSpace: "pre-line",
              lineHeight: 1.7,
            }}
          >
            {problem.description}
          </Typography>
        </Box>

        {/* Examples */}
        <Box>
          <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 3 }}>
            Examples
          </Typography>
          <Stack spacing={3}>
            {problem.test_cases.map((testCase, index) => (
              <Card key={index} sx={{ bgcolor: "#240046", p: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#FAF0CA", mb: 2 }}
                >
                  Example {index + 1}:
                </Typography>
                <Box sx={{ bgcolor: "#3C096C", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FAF0CA", fontFamily: "monospace" }}
                  >
                    Input: {testCase.input}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "#3C096C", p: 2, borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FAF0CA", fontFamily: "monospace" }}
                  >
                    Expected: {testCase.expected_output}
                  </Typography>
                </Box>
                {problem.metadata?.example_images?.[index] && (
                  <ProblemImage
                    imagePath={problem.metadata.example_images[index]}
                  />
                )}
              </Card>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default ProblemDetails;
