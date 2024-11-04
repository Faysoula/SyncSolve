import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CircularProgress, Alert, Typography } from "@mui/material";
import ProblemService from "../Services/problemService";
import { useAuth } from "../context/authContext";
import { EditorProvider, useEditor } from "../context/editorContext";
import ProblemDetails from "./problem-interface/ProblemDetails";
import EditorPanel from "./problem-interface/EditorPanel";
import TestResults from "./problem-interface/TestResults";

const ProblemContent = () => {
  const { problemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { runTests } = useEditor();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await ProblemService.getProblemById(problemId);
        setProblem(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problem");
        console.error("Failed to load problem:", err);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0a0118",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#9D4EDD" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0a0118",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Alert
          severity="error"
          sx={{
            bgcolor: "rgba(248, 113, 113, 0.1)",
            color: "#f87171",
            maxWidth: "600px",
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!problem) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0a0118",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: "#FAF0CA" }}>
          Problem not found
        </Typography>
      </Box>
    );
  }

  const handleRunTests = async () => {
    try {
      await runTests(problemId);
    } catch (error) {
      setError("Failed to run tests");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        minHeight: "100vh",
        bgcolor: "#0a0118",
        p: 8,
        pt: { xs: 12, md: 8 },
      }}
    >
      <ProblemDetails problem={problem} />

      <Card
        sx={{
          width: { xs: "100%", md: "50%" },
          bgcolor: "#3C096C",
          p: 4,
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          height: "fit-content",
          overflow: "hidden",
        }}
      >
        <EditorPanel onRunTests={handleRunTests} />
        <TestResults problem={problem} />
      </Card>
    </Box>
  );
};

// Wrap the main component with the EditorProvider
const ProblemSolvingInterface = () => {
  return (
    <EditorProvider>
      <ProblemContent />
    </EditorProvider>
  );
};

export default ProblemSolvingInterface;
