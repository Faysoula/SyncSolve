import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Copy, X } from "lucide-react";
import TeamService from "../Services/teamService";
import { useAuth } from "../context/authContext";

const TeamInviteModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await TeamService.createTeam({
        team_name: teamName,
        created_by: user.user_id,
      });

      // Generate and set invite link using team ID
      const teamId = response.data.team.team_id;
      const link = `${window.location.origin}/teams/join/${teamId}`;
      setInviteLink(link);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTeamName("");
    setError("");
    setInviteLink("");
    setCopied(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1A1626",
          color: "#FAF0CA",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6">Create Team</Typography>
        <IconButton onClick={handleClose} sx={{ color: "#FAF0CA" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(248, 113, 113, 0.1)",
                color: "#f87171",
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            fullWidth
            disabled={loading || !!inviteLink}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#FAF0CA",
                "& fieldset": { borderColor: "#5A189A" },
                "&:hover fieldset": { borderColor: "#7B2CBF" },
                "&.Mui-focused fieldset": { borderColor: "#9D4EDD" },
              },
              "& .MuiInputLabel-root": { color: "#FAF0CA" },
            }}
          />

          {inviteLink && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="#9D4EDD">
                Share this link with your team members:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  bgcolor: "rgba(60, 9, 108, 0.3)",
                  p: 2,
                  borderRadius: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "monospace",
                  }}
                >
                  {inviteLink}
                </Typography>
                <IconButton
                  onClick={handleCopyLink}
                  sx={{
                    color: copied ? "#4ade80" : "#9D4EDD",
                    "&:hover": { bgcolor: "rgba(157, 78, 221, 0.1)" },
                  }}
                >
                  <Copy size={18} />
                </IconButton>
              </Stack>
              {copied && (
                <Typography variant="caption" color="#4ade80">
                  Link copied to clipboard!
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: "#FAF0CA",
            "&:hover": { bgcolor: "rgba(157, 78, 221, 0.1)" },
          }}
        >
          Close
        </Button>
        {!inviteLink && (
          <Button
            onClick={handleCreateTeam}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#7B2CBF",
              color: "#FAF0CA",
              "&:hover": { bgcolor: "#9D4EDD" },
              "&:disabled": { bgcolor: "#5A189A" },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Create Team"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TeamInviteModal;
