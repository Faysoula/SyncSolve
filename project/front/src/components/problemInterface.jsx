
/**
 * @component
 * @description A problem solving interface component that provides a layout for coding problems.
 * It includes sections for problem details, code editor, and test results.
 * 
 * @remarks
 * The component is wrapped with EditorProvider and uses several contexts and services:
 * - EditorContext for code editor state management
 * - AuthContext for user authentication
 * - TeamContext for team-related data
 * - ProblemService for fetching problem data
 * 
 * The layout is divided into three main sections:
 * 1. Problem Details Panel (left)
 * 2. Editor Panel (top right)
 * 3. Test Results Panel (bottom right)
 * 
 * It also includes floating chat and call buttons for team collaboration when applicable.
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} The rendered problem solving interface
 * 
 * @example
 * ```jsx
 * <ProblemSolvingInterface />
 * ```
 * 
 * @requires react
 * @requires react-router-dom
 * @requires @mui/material
 * @requires ../Services/problemService
 * @requires ../context/editorContext
 * @requires ../context/authContext
 * @requires ../hooks/useTeam
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import ProblemService from "../Services/problemService";
import { EditorProvider, useEditor } from "../context/editorContext";
import { useAuth } from "../context/authContext";
import { useTeam } from "../hooks/useTeam"; // Import useTeam hook
import ProblemDetails from "./problem-interface/ProblemDetails";
import EditorPanel from "./problem-interface/EditorPanel";
import TestResults from "./problem-interface/TestResults";
import ChatButton from "./chat/chatButton"; // Fix import path
import CallButton from "./chat/callButton"; // Fix import path

const ProblemContent = () => {
  const { problemId, sessionId } = useParams();
  const { user } = useAuth();
  const { teamData } = useTeam(user?.user_id);
  const teamId = teamData?.team?.team_id;
  const { runTests } = useEditor();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Handle resize observer errors and setup
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to throttle updates
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
      });
    });

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
        height: "calc(100vh - 64px)", // Subtract header height
        p: 1.5,
        backgroundColor: "#0E0B1A",
        pt: { xs: 9, md: 1.5 },
        overflow: "hidden", // Prevent outer scrolling
        position: "relative", // For proper button positioning
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
          position: "relative",
        }}
      >
        <EditorPanel onRunTests={runTests} problem={problem} />
      </Box>

      {/* Test Results Panel */}
      <Box
        sx={{
          backgroundColor: "#1A1626",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TestResults problem={problem} />
      </Box>

      {/* Fixed position buttons */}
      {user && teamId && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 1000,
          }}
        >
          <CallButton teamId={teamId} sessionId={sessionId} />
          <ChatButton teamId={teamId} />
        </Box>
      )}
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
