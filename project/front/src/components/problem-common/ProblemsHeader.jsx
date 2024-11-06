import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import SessionStatusTag from "../sessionStatus";
import SessionTerminalService from "../../Services/sessionService";

export const ProblemsHeader = ({ problemCount }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const teamId = await SessionTerminalService.getUserTeam(user.user_id);
        if (teamId) {
          const session = await SessionTerminalService.getActiveSession(teamId);
          if (session && session.length > 0) {
            setActiveSession(session[0]);
          }
        }
      } catch (err) {
        console.error("Error checking active session:", err);
      }
    };

    if (user) {
      checkActiveSession();
    }
  }, [user]);

  const handleSessionClick = () => {
    if (activeSession) {
      navigate(
        `/problems/${activeSession.problem_id}/session/${activeSession.session_id}`
      );
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <BookOpen size={32} className="text-purple-400" />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#FAF0CA" }}>
            Problem Bank
          </Typography>
          {activeSession && (
            <div onClick={handleSessionClick}>
              <SessionStatusTag
                sessionId={activeSession.session_id}
                problemId={activeSession.problem_id}
              />
            </div>
          )}
        </Stack>

        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => navigate("/problems/add")}
          sx={{
            bgcolor: "#7B2CBF",
            color: "#FAF0CA",
            "&:hover": {
              bgcolor: "#9D4EDD",
            },
            px: 3,
            py: 1,
          }}
        >
          Add Problem
        </Button>
      </Stack>

      <Typography
        variant="body1"
        sx={{ color: "#FAF0CA", maxWidth: "600px", opacity: 0.7 }}
      >
        Sharpen your coding skills with our carefully curated collection of
        programming challenges.
        {problemCount > 0 &&
          ` Showing ${problemCount} problem${problemCount !== 1 ? "s" : ""}.`}
      </Typography>
    </Box>
  );
};

export default ProblemsHeader;
