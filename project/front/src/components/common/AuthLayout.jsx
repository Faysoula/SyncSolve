
/**
 * AuthLayout component that provides a layout for authentication pages.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} The rendered AuthLayout component.
 */
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
