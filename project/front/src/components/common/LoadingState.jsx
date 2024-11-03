import React from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0a0118",
        pt: 8,
        pb: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress
          size={40}
          sx={{
            color: "#7B2CBF",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <Typography variant="h6" sx={{ color: "#FAF0CA" }}>
          {message}
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoadingState;
