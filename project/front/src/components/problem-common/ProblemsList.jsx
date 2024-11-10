import React from "react";
import {
  Stack,
  Card,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { User, Clock, Edit, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { difficultyConfig } from "../../utils/constants";
import TeamService from "../../Services/teamService";
import SessionTerminalService from "../../Services/sessionService";

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
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [activeSession, setActiveSession] = React.useState(null);
  const [teamId, setTeamId] = React.useState(null);
  const [showSwitchDialog, setShowSwitchDialog] = React.useState(false);
  const isCreator = user?.user_id === problem.created_by;

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!user) return;

        const teamsResponse = await TeamService.getUserTeams(user.user_id);
        const teamMember = teamsResponse.data.teamMembers?.[0];
        
        if (teamMember) {
          setTeamId(teamMember.team_id);
          setIsAdmin(teamMember.role === "admin");
          
          // Get active session for the team
          const sessionResponse = await SessionTerminalService.getActiveSession(teamMember.team_id);
          if (sessionResponse && sessionResponse.length > 0) {
            setActiveSession(sessionResponse[0]);
          }
        }
      } catch (err) {
        console.error("Error checking status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [user]);

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
      // Create or get existing session
      const sessionResponse = await SessionTerminalService.createProblemSession(
        teamId,
        problem.problem_id
      );

      // If we have an active session for a different problem, end it
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

  // Handle member clicks
  if (activeSession) {
    // Changed this part - instead of using find, we just check the problem_id directly
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

  const startNewSession = async () => {
    try {
      const sessionResponse = await SessionTerminalService.createProblemSession(
        teamId,
        problem.problem_id
      );
      navigate(`/problems/${problem.problem_id}/session/${sessionResponse.session_id}`);
    } catch (err) {
      console.error("Error starting session:", err);
      setError("Failed to start session");
    }
  };

  const handleSwitchProblem = async () => {
    try {
      // You'll need to implement this endpoint
      await SessionTerminalService.updateSession(activeSession.session_id, problem.problem_id);
      navigate(`/problems/${problem.problem_id}/session/${activeSession.session_id}`);
    } catch (err) {
      console.error("Error switching problem:", err);
      setError("Failed to switch problem");
    } finally {
      setShowSwitchDialog(false);
    }
  };

  const canClickProblem = isAdmin || (activeSession?.problem_id === problem.problem_id);

  return (
  <>
    <Card
      sx={{
        ...styles.problemCard,
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
              <Stack spacing={2}>
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
                      {activeSession?.problem_id === problem.problem_id && !isAdmin && (
                        <Chip
                          label="Session Active"
                          size="small"
                          sx={{
                            ml: 2,
                            bgcolor: "rgba(74, 222, 128, 0.1)",
                            color: "#4ade80",
                            borderColor: "#4ade80",
                            border: "1px solid",
                          }}
                        />
                      )}
                    </Typography>
                    <Chip
                      label={difficultyConfig[problem.difficulty].label}
                      sx={{
                        color: difficultyConfig[problem.difficulty].color,
                        bgcolor: difficultyConfig[problem.difficulty].background,
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

                <Box>
                  {problem.metadata?.tags && problem.metadata.tags.length > 0 ? (
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

              <Typography variant="body2" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
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

    <Dialog
      open={showSwitchDialog}
      onClose={() => setShowSwitchDialog(false)}
      PaperProps={{
        sx: {
          bgcolor: "#1A1626",
          color: "#FAF0CA",
          maxWidth: "400px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AlertTriangle color="#fbbf24" />
          <Typography variant="h6">Switch Problem?</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#FAF0CA", opacity: 0.9 }}>
          Your current session will be transferred to "{problem.title}". The previous work 
          wont be saved but were woeking on it. Do you want to continue?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={() => setShowSwitchDialog(false)}
          sx={{
            color: "#FAF0CA",
            "&:hover": { bgcolor: "rgba(157, 78, 221, 0.1)" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSwitchProblem}
          sx={{
            bgcolor: "#7B2CBF",
            color: "#FAF0CA",
            "&:hover": { bgcolor: "#9D4EDD" },
          }}
        >
          Switch Problem
        </Button>
      </DialogActions>
    </Dialog>
  </>
)
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
