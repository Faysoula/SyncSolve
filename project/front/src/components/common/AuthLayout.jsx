import React from "react";
import { Box, Container, Paper } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, textAlign: "center" }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
