import React from "react";
import { Box, Chip, Typography, Stack, Divider } from "@mui/material";
import { Clock, Hash } from "lucide-react";
import ProblemImage from "../problem-common/ProblemImage";

const ProblemDetails = ({ problem }) => {
  if (!problem) return null;

  return (
    <Stack spacing={4}>
      {/* Problem Header */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: "#FAF0CA",
            fontWeight: 600,
            mb: 2,
          }}
        >
          {problem.title}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={problem.difficulty.toUpperCase()}
            size="small"
            sx={{
              bgcolor:
                problem.difficulty === "easy"
                  ? "rgba(74, 222, 128, 0.1)"
                  : problem.difficulty === "medium"
                  ? "rgba(251, 191, 36, 0.1)"
                  : "rgba(248, 113, 113, 0.1)",
              color:
                problem.difficulty === "easy"
                  ? "#4ade80"
                  : problem.difficulty === "medium"
                  ? "#fbbf24"
                  : "#f87171",
              fontWeight: 600,
              border: "1px solid currentColor",
            }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Clock size={14} style={{ color: "#9D4EDD" }} />
            <Typography variant="caption" sx={{ color: "#9D4EDD" }}>
              {new Date(problem.created_at).toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(157, 78, 221, 0.2)" }} />

      {/* Tags */}
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Hash size={16} style={{ color: "#9D4EDD" }} />
          <Typography variant="subtitle2" sx={{ color: "#9D4EDD" }}>
            Topics
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {problem.metadata?.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: "rgba(157, 78, 221, 0.1)",
                color: "#9D4EDD",
                border: "1px solid rgba(157, 78, 221, 0.3)",
                "&:hover": {
                  bgcolor: "rgba(157, 78, 221, 0.15)",
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Problem Description */}
      <Box>
        <Typography
          sx={{
            color: "#FAF0CA",
            opacity: 0.9,
            whiteSpace: "pre-line",
            lineHeight: 1.7,
            fontSize: "0.95rem",
          }}
        >
          {problem.description}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(157, 78, 221, 0.2)" }} />

      {/* Examples */}
      <Box>
        <Typography variant="subtitle2" sx={{ color: "#9D4EDD", mb: 2 }}>
          Examples
        </Typography>
        <Stack spacing={3}>
          {problem.test_cases.map((testCase, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "rgba(60, 9, 108, 0.3)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#9D4EDD", mb: 1, display: "block" }}
              >
                Example {index + 1}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ bgcolor: "#1A1626", p: 2, borderRadius: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#9D4EDD", mb: 0.5, display: "block" }}
                  >
                    Input:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FAF0CA", fontFamily: "monospace" }}
                  >
                    {testCase.input}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "#1A1626", p: 2, borderRadius: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#9D4EDD", mb: 0.5, display: "block" }}
                  >
                    Expected Output:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FAF0CA", fontFamily: "monospace" }}
                  >
                    {testCase.expected_output}
                  </Typography>
                </Box>
                {problem.metadata?.example_images?.[index] && (
                  <ProblemImage
                    imagePath={problem.metadata.example_images[index]}
                  />
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default ProblemDetails;
