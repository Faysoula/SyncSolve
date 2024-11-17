import React from "react";
import { Stack, Typography } from "@mui/material";
import { User, Clock } from "lucide-react";

export const ProblemMetadata = ({ username, date }) => (
  <Stack spacing={1} sx={{ width: "100%" }}>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent={{ xs: "flex-start", md: "flex-end" }}
    >
      <User size={16} sx={{ color: "#FAF0CA" }} />
      <Typography variant="caption" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
        {username || "Unknown User"}
      </Typography>
    </Stack>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent={{ xs: "flex-start", md: "flex-end" }}
    >
      <Clock size={16} sx={{ color: "#FAF0CA" }} />
      <Typography variant="caption" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
        {new Date(date).toLocaleDateString()}
      </Typography>
    </Stack>
  </Stack>
);
