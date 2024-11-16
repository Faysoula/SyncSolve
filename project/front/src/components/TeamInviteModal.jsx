import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { X } from "lucide-react";
import { useAuth } from "../context/authContext";
import TeamService from "../Services/teamService";
import TeamInviteForm from "./team/TeamInviteForm";
import { teamstyles as styles } from "../utils/styles";

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

      const teamId = response.data.team.team_id;
      setInviteLink(`${window.location.origin}/teams/join/${teamId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTeamName("");
    setError("");
    setInviteLink("");
    setCopied(false);
    onClose();
    window.location.reload();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      maxWidth="sm"
      fullWidth
      PaperProps={styles.dialogPaper}
    >
      <DialogTitle
        sx={{
          ...styles.dialogTitle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Changed from Typography to span to avoid heading nesting issues */}
        <span
          style={{ fontSize: "1.25rem", fontWeight: 600, color: "#FAF0CA" }}
        >
          Create Team
        </span>
        <IconButton
          onClick={handleReset}
          sx={{
            color: "#FAF0CA",
            "&:hover": {
              backgroundColor: "rgba(250, 240, 202, 0.1)",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TeamInviteForm
          teamName={teamName}
          error={error}
          inviteLink={inviteLink}
          copied={copied}
          onTeamNameChange={setTeamName}
          onCopyLink={handleCopyLink}
        />
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={handleReset}
          sx={{
            color: "#FAF0CA",
            "&:hover": {
              backgroundColor: "rgba(157, 78, 221, 0.1)",
            },
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
              "&:hover": {
                bgcolor: "#9D4EDD",
              },
              "&:disabled": {
                bgcolor: "#5A189A",
              },
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