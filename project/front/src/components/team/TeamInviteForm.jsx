import React from "react";
import { Stack, TextField, Typography, Alert, IconButton } from "@mui/material";
import { Copy } from "lucide-react";

const TeamInviteForm = ({
  teamName,
  error,
  inviteLink,
  copied,
  onTeamNameChange,
  onCopyLink,
}) => (
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
      onChange={(e) => onTeamNameChange(e.target.value)}
      fullWidth
      disabled={!!inviteLink}
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
            onClick={onCopyLink}
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
);

export default TeamInviteForm;