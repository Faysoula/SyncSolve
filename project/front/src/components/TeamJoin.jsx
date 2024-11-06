import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { Users, AlertTriangle } from "lucide-react";
import TeamService from "../Services/teamService";
import { useAuth } from "../context/authContext";

const TeamJoin = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [team, setTeam] = useState(null);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    const validateTeam = async () => {
      try {
        setLoading(true);
        // First get the team details
        const teamResponse = await TeamService.getTeamById(teamId);
        const teamData = teamResponse.data;

        // Get user's current team if any
        const userTeamsResponse = await TeamService.getUserTeams(user.user_id);
        const userTeams = userTeamsResponse.data.teamMembers;

        if (userTeams && userTeams.length > 0) {
          const currentTeamResponse = await TeamService.getTeamById(
            userTeams[0].team_id
          );
          setCurrentTeam(currentTeamResponse.data);
        }

        // Then get all members for this team
        const membersResponse = await TeamService.getTeamMembers(teamId);
        const members = membersResponse.data.teamMembers || [];

        // Check if user is already a member of this specific team
        const isMember = members.some(
          (member) => member.user_id === user.user_id
        );

        if (isMember) {
          setError("You are already a member of this team");
        } else if (members.length >= 3) {
          setError("This team is already full");
        } else {
          setTeam(teamData);
          // If user has a current team, show warning modal
          if (currentTeam) {
            setShowWarningModal(true);
          }
        }
      } catch (err) {
        console.error("Team validation error:", err);
        setError("Invalid team invite link");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      validateTeam();
    } else {
      setError("Please sign in to join the team");
      setLoading(false);
    }
  }, [teamId, user]);

  const handleLeaveCurrentTeam = async () => {
    try {
      const membersResponse = await TeamService.getTeamMembers(
        currentTeam.team_id
      );
      const currentMember = membersResponse.data.teamMembers.find(
        (m) => m.user_id === user.user_id
      );

      if (currentMember) {
        await TeamService.removeTeamMember(currentMember.team_member_id);
      }
    } catch (error) {
      console.error("Error leaving current team:", error);
      throw error;
    }
  };

  const handleJoinTeam = async () => {
    try {
      setJoining(true);
      setError("");

      // If user has a current team, leave it first
      if (currentTeam) {
        await handleLeaveCurrentTeam();
      }

      await TeamService.addTeamMember({
        team_id: teamId,
        user_id: user.user_id,
        role: "member",
      });

      setSuccess(true);
      setShowWarningModal(false);

      // Wait a moment before redirecting
      setTimeout(() => {
        navigate("/problems", { replace: true });
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Join team error:", err);
      setError(err.response?.data?.message || "Failed to join team");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0a0118",
        }}
      >
        <CircularProgress sx={{ color: "#9D4EDD" }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0a0118",
          p: 3,
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            bgcolor: "#1A1626",
            p: 4,
            textAlign: "center",
          }}
        >
          <Users size={48} style={{ color: "#9D4EDD", marginBottom: "1rem" }} />

          {error ? (
            <>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  bgcolor: "rgba(248, 113, 113, 0.1)",
                  color: "#f87171",
                }}
              >
                {error}
              </Alert>
              <Button
                variant="outlined"
                onClick={() => navigate("/problems")}
                sx={{
                  color: "#FAF0CA",
                  borderColor: "#5A189A",
                  "&:hover": { borderColor: "#7B2CBF", bgcolor: "#240046" },
                }}
              >
                Back to Problems
              </Button>
            </>
          ) : success ? (
            <Alert
              severity="success"
              sx={{ bgcolor: "rgba(74, 222, 128, 0.1)", color: "#4ade80" }}
            >
              Successfully joined the team! Redirecting...
            </Alert>
          ) : (
            <>
              <Typography variant="h5" sx={{ color: "#FAF0CA", mb: 1 }}>
                Join Team
              </Typography>
              {team && (
                <Typography sx={{ color: "#FAF0CA", opacity: 0.8, mb: 3 }}>
                  You're invited to join {team.team_name}
                </Typography>
              )}
              {/* Removed the !currentTeam condition */}
              <Button
                variant="contained"
                onClick={
                  currentTeam ? () => setShowWarningModal(true) : handleJoinTeam
                }
                disabled={joining}
                sx={{
                  bgcolor: "#7B2CBF",
                  color: "#FAF0CA",
                  "&:hover": { bgcolor: "#9D4EDD" },
                  "&:disabled": { bgcolor: "#5A189A" },
                }}
              >
                {joining ? <CircularProgress size={24} /> : "Join Team"}
              </Button>
            </>
          )}
        </Card>
      </Box>

      {/* Warning Modal remains the same */}
      <Dialog
        open={showWarningModal}
        onClose={() => setShowWarningModal(false)}
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
            <Typography variant="h6">Leave Current Team?</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#FAF0CA", opacity: 0.9 }}>
            Joining "{team?.team_name}" will automatically remove you from your
            current team "{currentTeam?.team_name}". Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setShowWarningModal(false)}
            sx={{
              color: "#FAF0CA",
              "&:hover": { bgcolor: "rgba(157, 78, 221, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleJoinTeam}
            disabled={joining}
            sx={{
              bgcolor: "#7B2CBF",
              color: "#FAF0CA",
              "&:hover": { bgcolor: "#9D4EDD" },
              "&:disabled": { bgcolor: "#5A189A" },
            }}
          >
            {joining ? <CircularProgress size={24} /> : "Continue & Join"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamJoin;