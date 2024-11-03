import React from "react";
import { Card, Stack, Typography, Button } from "@mui/material";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthRequiredCard = () => {
  const navigate = useNavigate();

  return (
    <Stack
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
      <Card
        sx={{
          bgcolor: "#3C096C",
          p: 4,
          maxWidth: "md",
          textAlign: "center",
          borderRadius: 2,
          width: { xs: "90%", sm: "600px" },
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h5" sx={{ color: "#FAF0CA" }}>
            Sign in to Access Problems
          </Typography>
          <Typography variant="body1" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
            Please sign in or create an account to view and solve programming
            problems.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<LogIn size={18} />}
              onClick={() => navigate("/signin")}
              sx={{
                bgcolor: "#7B2CBF",
                color: "#FAF0CA",
                "&:hover": {
                  bgcolor: "#9D4EDD",
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/register")}
              sx={{
                borderColor: "#7B2CBF",
                color: "#FAF0CA",
                "&:hover": {
                  borderColor: "#9D4EDD",
                  bgcolor: "rgba(125, 44, 191, 0.1)",
                },
              }}
            >
              Create Account
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default AuthRequiredCard;
