/**
 * ProblemCard displays a coding problem with its details and handles problem session management
 *
 * @component
 * @param {Object} props
 * @param {Object} props.problem - Problem object containing title, description, difficulty, etc.
 * @param {string} props.username - Username of problem creator
 *
 * Features:
 * - Displays problem title, difficulty, and daily status
 * - Shows active session status
 * - Allows admin to start/switch sessions
 * - Enables problem editing for creators
 * - Handles team session management
 *
 * Examples:
 * <ProblemCard
 *   problem={problemData}
 *   username="johndoe"
 * />
 */
import React from "react";
import {
  Card,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { difficultyConfig } from "../../utils/constants";
import { problemListStyles } from "../../utils/styles";
import { useProblemCard } from "../../hooks/useProblemCard";
import { ProblemMetadata } from "../problem-common/problem-list-com/ProblemMetadata";
import { ProblemTags } from "../problem-common/problem-list-com/ProblemTags";
import { SwitchProblemDialog } from "../problem-common/problem-list-com/SwitchProblemDialog";
import SessionTerminalService from "../../Services/sessionService";

export const ProblemCard = ({ problem, username }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isAdmin,
    error,
    setError,
    activeSession,
    teamId,
    showSwitchDialog,
    setShowSwitchDialog,
    isCreator,
  } = useProblemCard(problem);

  const handleProblemClick = async (e) => {
    e.preventDefault();

    if (!teamId) {
      setError("You need to be in a team first!");
      return;
    }

    if (isAdmin) {
      if (activeSession && activeSession.problem_id !== problem.problem_id) {
        setShowSwitchDialog(true);
        return;
      }
      try {
        const sessionResponse =
          await SessionTerminalService.createProblemSession(
            teamId,
            problem.problem_id
          );

        if (activeSession && activeSession.problem_id !== problem.problem_id) {
          await SessionTerminalService.endSession(activeSession.session_id);
        }

        navigate(
          `/problems/${problem.problem_id}/session/${sessionResponse.session_id}`
        );
      } catch (err) {
        console.error("Error handling session:", err);
        setError("Failed to manage session");
      }
      return;
    }

    if (activeSession) {
      if (activeSession.problem_id === problem.problem_id) {
        navigate(
          `/problems/${problem.problem_id}/session/${activeSession.session_id}`
        );
      } else {
        setError("Your team needs you somewhere else!");
      }
    } else {
      setError("Wait for admin to start a session");
    }
  };

  const handleSwitchProblem = async () => {
    try {
      await SessionTerminalService.updateSession(
        activeSession.session_id,
        problem.problem_id
      );
      navigate(
        `/problems/${problem.problem_id}/session/${activeSession.session_id}`
      );
    } catch (err) {
      console.error("Error switching problem:", err);
      setError("Failed to switch problem");
    } finally {
      setShowSwitchDialog(false);
    }
  };

  const canClickProblem =
    isAdmin || activeSession?.problem_id === problem.problem_id;

  return (
    <>
      <Card
        sx={{
          ...problemListStyles.problemCard,
          cursor: canClickProblem ? "pointer" : "default",
          "&:hover": canClickProblem
            ? {
                transform: "translateY(-2px)",
                bgcolor: "#5A189A",
              }
            : {},
          ...(activeSession?.problem_id === problem.problem_id && {
            borderColor: "#4ade80",
            borderWidth: 1,
            borderStyle: "solid",
          }),
          ...(problem.metadata?.is_daily && {
            position: "relative",
            borderColor: "#ffab40",
            borderWidth: 1,
            borderStyle: "solid",
          }),
        }}
        onClick={handleProblemClick}
      >
        <Box sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Box sx={{ flex: { xs: "1", md: "3" } }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ color: "#FAF0CA", fontWeight: 600 }}
                      >
                        {problem.title}
                      </Typography>
                      {problem.metadata?.is_daily && (
                        <Chip
                          label="Daily"
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 171, 64, 0.1)",
                            color: "#ffab40",
                            borderColor: "#ffab40",
                            border: "1px solid",
                          }}
                        />
                      )}
                      {activeSession?.problem_id === problem.problem_id &&
                        !isAdmin && (
                          <Chip
                            label="Session Active"
                            size="small"
                            sx={{
                              bgcolor: "rgba(74, 222, 128, 0.1)",
                              color: "#4ade80",
                              borderColor: "#4ade80",
                              border: "1px solid",
                            }}
                          />
                        )}
                    </Stack>
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

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      bgcolor: "rgba(248, 113, 113, 0.1)",
                      color: "#f87171",
                    }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}

                <ProblemTags tags={problem.metadata?.tags} />

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

      <SwitchProblemDialog
        open={showSwitchDialog}
        onClose={() => setShowSwitchDialog(false)}
        onConfirm={handleSwitchProblem}
        problemTitle={problem.title}
      />
    </>
  );
};
