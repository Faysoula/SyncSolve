import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import ProblemService from "../Services/problemService";
import { EditorProvider, useEditor } from "../context/editorContext";
import ProblemDetails from "./problem-interface/ProblemDetails";
import EditorPanel from "./problem-interface/EditorPanel";
import TestResults from "./problem-interface/TestResults";

const ProblemContent = () => {
  const { problemId } = useParams();
  const { runTests } = useEditor();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Handle resize observer errors and setup
  useEffect(() => {
    // Create a custom ResizeObserver with error handling
    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to throttle updates
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
      });
    });

    // Add error handler for ResizeObserver
    const errorHandler = (event) => {
      if (event.message && event.message.includes("ResizeObserver")) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", errorHandler);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await ProblemService.getProblemById(problemId);
        setProblem(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  const handleRunTests = async () => {
    try {
      await runTests(problemId);
    } catch (error) {
      setError("Failed to run tests");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
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

  if (error || !problem) {
    return (
      <Box
        sx={{
          height: "100vh",
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
          {error || "Problem not found"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gridTemplateRows: "1fr 400px",
        gap: 1.5,
        height: "100vh",
        p: 1.5,
        backgroundColor: "#0E0B1A",
        pt: { xs: 9, md: 1.5 },
        overflow: "hidden",
        minWidth: "800px", // Add minimum width
        minHeight: "600px", // Add minimum height
        "& .monaco-editor, & .overflow-guard": {
          width: "100% !important",
          height: "100% !important",
          position: "relative !important",
        },
      }}
    >
      {/* Problem Details Panel */}
      <Box
        sx={{
          gridRow: "1 / span 2",
          backgroundColor: "#1A1626",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Allow shrinking
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: 2.5,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#1A1626",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#3C096C",
              borderRadius: "3px",
            },
          }}
        >
          <ProblemDetails problem={problem} />
        </Box>
      </Box>

      {/* Editor Panel */}
      <Box
        sx={{
          backgroundColor: "#1A1626",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0, // Allow shrinking
          position: "relative", // Needed for Monaco editor
        }}
      >
        <EditorPanel
          onRunTests={handleRunTests}
          sx={{
            flex: 1,
            "& .monaco-editor": {
              width: "100% !important",
              height: "100% !important",
            },
          }}
        />
      </Box>

      {/* Test Results Panel */}
      <Box
        sx={{
          backgroundColor: "#1A1626",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Allow shrinking
        }}
      >
        <TestResults
          problem={problem}
          sx={{
            height: "100%",
            overflow: "hidden",
          }}
        />
      </Box>
    </Box>
  );
};

const ProblemSolvingInterface = () => {
  return (
    <EditorProvider>
      <ProblemContent />
    </EditorProvider>
  );
};

export default ProblemSolvingInterface;
