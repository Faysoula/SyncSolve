import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Users } from "lucide-react";
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

  useEffect(() => {
    const validateTeam = async () => {
      try {
        setLoading(true);
        // First get the team details
        const teamResponse = await TeamService.getTeamById(teamId);
        const teamData = teamResponse.data;

        // Then get all members for this team
        const membersResponse = await TeamService.getTeamMembers(teamId);
        const members = membersResponse.data.teamMembers || [];

        // Check if user is already a member
        const isMember = members.some(
          (member) => member.user_id === user.user_id
        );

        if (isMember) {
          setError("You are already a member of this team");
        } else {
          setTeam(teamData);
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

  const handleJoinTeam = async () => {
    try {
      setJoining(true);
      setError("");

      await TeamService.addTeamMember({
        team_id: teamId,
        user_id: user.user_id,
        role: "member",
      });

      setSuccess(true);

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
              {joining ? <CircularProgress size={24} /> : "Join Team"}
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
};

export default TeamJoin;
