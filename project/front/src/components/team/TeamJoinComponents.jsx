import React from "react";
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
import { AlertTriangle, Users } from "lucide-react";

export const LoadingState = () => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#0E0B1A",
    }}
  >
    <CircularProgress sx={{ color: "#9D4EDD" }} />
  </Box>
);

export const TeamJoinCard = ({
  error,
  success,
  team,
  joining,
  onJoin,
  onNavigateBack,
}) => (
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
          onClick={onNavigateBack}
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
          onClick={onJoin}
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
);

export const TeamTransferWarningDialog = ({
  open,
  currentTeam,
  newTeam,
  onCancel,
  onConfirm,
  joining,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
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
        Joining "{newTeam?.team_name}" will automatically remove you from your
        current team "{currentTeam?.team_name}". Do you want to continue?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, pt: 0 }}>
      <Button
        onClick={onCancel}
        sx={{
          color: "#FAF0CA",
          "&:hover": { bgcolor: "rgba(157, 78, 221, 0.1)" },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
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
);
