/**
 * @module TeamComponents
 * @description A collection of reusable team-related UI components built with Material-UI.
 */

/**
 * @component LoadingButton
 * @description A button component that displays a loading spinner.
 * @returns {JSX.Element} A Material-UI Button with a CircularProgress indicator
 */

/**
 * @component CreateTeamButton
 * @description A button component for team creation with an icon.
 * @param {Object} props
 * @param {Function} props.onClick - Click event handler for the button
 * @returns {JSX.Element} A Material-UI Button with Users icon
 */

/**
 * @component SuccessSnackbar
 * @description A snackbar component that displays a success message for clipboard copy.
 * @param {Object} props
 * @param {boolean} props.open - Controls the visibility of the snackbar
 * @param {Function} props.onClose - Handler for closing the snackbar
 * @returns {JSX.Element} A Material-UI Snackbar with success Alert
 */

/**
 * @component TeamDropdownButton
 * @description A dropdown button component displaying team information.
 * @param {Object} props
 * @param {string} props.teamName - The name of the team to display
 * @param {boolean} props.isAdmin - Flag indicating if the user is an admin
 * @param {Function} props.onClick - Click event handler for the button
 * @returns {JSX.Element} A Material-UI Button with team information
 */
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
