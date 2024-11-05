import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { EditorProvider, useEditor } from "../context/editorContext";
import ProblemService from "../Services/problemService";
import { useAuth } from "../context/authContext";
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
          bgcolor: "#0E0B1A",
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
          bgcolor: "#0E0B1A",
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
          bgcolor: "#0E0B1A",
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
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gridTemplateRows: "1fr 250px",
        gap: 2,
        height: "100vh",
        p: 2,
        backgroundColor: "#0E0B1A",
        pt: { xs: 10, md: 2 }, // Account for AppBar
      }}
    >
      {/* Problem Details Panel - Left Side */}
      <Box
        sx={{
          gridRow: "1 / span 2",
          backgroundColor: "#1A1626",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            p: 3,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#1A1626",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#3C096C",
              borderRadius: "4px",
            },
          }}
        >
          <ProblemDetails problem={problem} />
        </Box>
      </Box>

      {/* Code Editor Panel - Top Right */}
      <Box
        sx={{
          backgroundColor: "#1A1626",
          borderRadius: "12px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
        }}
      >
        <EditorPanel
          onRunTests={handleRunTests}
          sx={{
            height: "100%",
            "& .monaco-editor": {
              borderRadius: "8px",
              padding: "8px",
            },
          }}
        />
      </Box>

      {/* Test Results Panel - Bottom Right */}
      <Box
        sx={{
          backgroundColor: "#1A1626",
          borderRadius: "12px",
          p: 2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TestResults
          problem={problem}
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        />
      </Box>
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
