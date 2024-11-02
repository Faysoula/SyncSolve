import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Users, Code, FileCode } from "lucide-react";
import FeatureCard from "./cards/FeatureCard";
import StatCard from "./cards/StatCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        flex: 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              minHeight: "70px !important",
              px: { xs: 2, sm: 3 },
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              SyncSolve
            </Typography>
            <Button
              color="inherit"
              sx={{
                minWidth: "auto",
                px: { xs: 2, sm: 3 },
              }}
              onClick={() => navigate("/Signin")}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                minWidth: "auto",
                px: { xs: 2, sm: 3 },
              }}
              onClick={() => navigate("/Register")}
            >
              Sign Up
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        <Toolbar />

        {/* Hero Section */}
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", sm: "3.75rem" },
              background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
            }}
          >
            Solve Together.
            <br />
            Grow Together.
          </Typography>
          <Typography
            variant="h5"
            color="secondary.light"
            sx={{
              mb: 4,
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1.125rem", sm: "1.5rem" },
            }}
          >
            Join the community where teams collaborate on competitive
            programming challenges in real-time.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/Register")}
            endIcon={
              <Box component="span" sx={{ ml: 1 }}>
                →
              </Box>
            }
          >
            Start Coding Now
          </Button>
        </Box>

        {/* Features Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ mb: 8 }}
        >
          <FeatureCard
            icon={<Users />}
            title="Team Collaboration"
            description="Work together in real-time with your teammates to solve challenging problems"
          />
          <FeatureCard
            icon={<Code />}
            title="Live Coding"
            description="Write, test, and debug code together in a synchronized environment"
          />
          <FeatureCard
            icon={<FileCode />}
            title="Custom Problems"
            description="Create and share your own programming challenges with the community"
          />
        </Stack>

        {/* Stats Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            color="secondary.light"
            gutterBottom
            sx={{
              mb: 4,
              fontSize: { xs: "2rem", sm: "3rem" },
            }}
          >
            Join Our Growing Community
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <StatCard number="10,000+" label="Active Users" />
            <StatCard number="1,000+" label="Custom Problems" />
            <StatCard number="50,000+" label="Solutions Submitted" />
          </Stack>
        </Box>

        {/* Preview Section */}
        <Card sx={{ mb: 0 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              color="secondary.light"
              gutterBottom
              sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              Experience Real-time Collaboration
            </Typography>
            <Typography color="secondary.main" sx={{ mb: 4 }}>
              Watch your team's code come together in perfect synchronization
            </Typography>
            <Box
              sx={{
                height: 300,
                bgcolor: "primary.dark",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="secondary.dark">
                Interactive Code Editor Preview
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LandingPage;
