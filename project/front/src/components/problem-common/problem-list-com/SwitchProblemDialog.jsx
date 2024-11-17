import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

export const SwitchProblemDialog = ({
  open,
  onClose,
  onConfirm,
  problemTitle,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
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
        Your current session will be transferred to "{problemTitle}". The
        previous work wont be saved but were working on it. Do you want to
        continue?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, pt: 0 }}>
      <Button
        onClick={onClose}
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
);
