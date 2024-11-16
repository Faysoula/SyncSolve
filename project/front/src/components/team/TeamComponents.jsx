import React from "react";
import {
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Users, ChevronDown } from "lucide-react";

export const LoadingButton = () => (
  <Button
    variant="contained"
    sx={{
      bgcolor: "#240046",
      minWidth: 120,
      color: "#FAF0CA",
    }}
  >
    <CircularProgress size={20} color="inherit" />
  </Button>
);

export const CreateTeamButton = ({ onClick }) => (
  <Button
    variant="contained"
    startIcon={<Users size={20} />}
    onClick={onClick}
    sx={{
      bgcolor: "#240046",
      color: "#FAF0CA",
      "&:hover": {
        bgcolor: "#3C096C",
      },
      px: 3,
      py: 1,
    }}
  >
    Create Team
  </Button>
);

export const SuccessSnackbar = ({ open, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={2000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      severity="success"
      sx={{
        bgcolor: "rgba(74, 222, 128, 0.1)",
        color: "#4ade80",
        border: "1px solid",
        borderColor: "rgba(74, 222, 128, 0.2)",
      }}
    >
      Invite link copied to clipboard!
    </Alert>
  </Snackbar>
);

export const TeamDropdownButton = ({ teamName, isAdmin, onClick }) => (
  <Button
    onClick={onClick}
    variant="contained"
    endIcon={<ChevronDown size={16} />}
    sx={{
      bgcolor: "#240046",
      color: "#FAF0CA",
      "&:hover": {
        bgcolor: "#3C096C",
      },
      px: 3,
      py: 1,
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      <Users size={20} />
      <Typography>{isAdmin ? `${teamName} (Admin)` : teamName}</Typography>
    </Stack>
  </Button>
);