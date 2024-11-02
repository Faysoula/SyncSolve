import React from "react";
import { Box, Typography, Container, Stack, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "primary.light",
        py: 3,
        backgroundColor: "rgba(60, 9, 108, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 4 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.secondary.light,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © 2024 SyncSolve. Build something amazing together.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ color: theme.palette.secondary.light }}
          >
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
