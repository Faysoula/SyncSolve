import React, { useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../context/authContext";
import TeamDropdown from "../TeamDropdown";
import TeamInviteModal from "../TeamInviteModal";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const isLandingPage = location.pathname === "/";

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const getInitials = () => {
    if (!user?.name) return "?";
    return `${user.name.charAt(0)}${
      user.last_name ? user.last_name.charAt(0) : ""
    }`;
  };

  return (
    <>
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
                fontWeight: "bold",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              SyncSolve
            </Typography>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Team Section - Only show if user is logged in AND not on landing page */}
            {user && !isLandingPage && (
              <Box sx={{ mr: 2 }}>
                <TeamDropdown onCreateTeam={() => setIsTeamModalOpen(true)} />
              </Box>
            )}

            {user ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    color="secondary.light"
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {user.name} {user.last_name}
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuClick}
                    sx={{
                      p: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ChevronDown size={18} />
                  </IconButton>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      backgroundColor: "primary.dark",
                      color: "secondary.light",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/profile");
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  color="inherit"
                  onClick={() => navigate("/Signin")}
                  sx={{
                    minWidth: "auto",
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/Register")}
                  sx={{
                    minWidth: "auto",
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Team Creation Modal */}
      <TeamInviteModal
        open={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </>
  );
};

export default Header;
