import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import {
  Users,
  ChevronDown,
  LogOut,
  Crown,
  Link as LinkIcon,
} from "lucide-react";
import TeamService from "../Services/teamService";
import { useAuth } from "../context/authContext";

const TeamDropdown = ({ onCreateTeam }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const userTeamsResponse = await TeamService.getUserTeams(user.user_id);
      const userTeams = userTeamsResponse.data.teamMembers;

      if (!userTeams || userTeams.length === 0) {
        const allTeamsResponse = await TeamService.getAllTeams();
        const adminTeam = allTeamsResponse.data.teams?.find((team) =>
          team.TeamMembers?.some(
            (member) =>
              member.user_id === user.user_id && member.role === "admin"
          )
        );

        if (adminTeam) {
          const membersResponse = await TeamService.getTeamMembers(
            adminTeam.team_id
          );
          setTeamData({
            team: adminTeam,
            members: membersResponse.data.teamMembers || [],
            userRole: "admin",
          });
        } else {
          setTeamData(null);
        }
      } else {
        const userTeam = userTeams[0];
        const teamResponse = await TeamService.getTeamById(userTeam.team_id);
        const membersResponse = await TeamService.getTeamMembers(
          userTeam.team_id
        );

        setTeamData({
          team: teamResponse.data,
          members: membersResponse.data.teamMembers || [],
          userRole: userTeam.role,
        });
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      setTeamData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeamData();
    }
  }, [user]);

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/teams/join/${teamData.team.team_id}`;
    navigator.clipboard.writeText(inviteLink);
    setOpenSnackbar(true);
    handleClose();
  };

  const handleLeaveTeam = async () => {
    try {
      const membershipToRemove = teamData.members.find(
        (m) => m.user_id === user.user_id
      );

      if (!membershipToRemove) return;

      // If admin is leaving and there are other members, transfer admin role
      if (membershipToRemove.role === "admin" && teamData.members.length > 1) {
        // Find the first non-admin member to promote
        const newAdmin = teamData.members.find(
          (m) => m.user_id !== user.user_id
        );
        if (newAdmin) {
          // Update the new admin's role first
          await TeamService.updateTeamMemberRole({
            team_member_id: newAdmin.team_member_id,
            role: "admin",
          });
        }
      }

      // Now remove the mmemebr whos leaving
      await TeamService.removeTeamMember(membershipToRemove.team_member_id);

      // If this was the last member, the team will be automatically deleted
      // by the cascade delete in database

      setTeamData(null);
      setAnchorEl(null);
      window.location.reload();
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
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
  }

  if (!teamData) {
    return (
      <Button
        variant="contained"
        startIcon={<Users size={20} />}
        onClick={onCreateTeam}
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
  }

  return (
    <>
      <Box>
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
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
            <Typography>
              {teamData?.userRole === "admin"
                ? `${teamData.team.team_name} (Admin)`
                : teamData?.team.team_name}
            </Typography>
          </Stack>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              bgcolor: "#1A1626",
              color: "#FAF0CA",
              minWidth: "200px",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="#9D4EDD">
              Team Members ({teamData?.members?.length || 0}/3)
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(157, 78, 221, 0.2)" }} />

          {teamData?.members.map((member) => (
            <MenuItem
              key={member.user_id}
              sx={{
                py: 1,
                "&:hover": {
                  bgcolor: "rgba(157, 78, 221, 0.1)",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#3C096C",
                    fontSize: "0.875rem",
                  }}
                >
                  {member.User?.name?.charAt(0) ||
                    member.User?.username?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    {member.User?.name || member.User?.username}
                  </Typography>
                </Box>
                {member.role === "admin" && <Crown size={16} color="#fbbf24" />}
              </Stack>
            </MenuItem>
          ))}

          <Divider sx={{ borderColor: "rgba(157, 78, 221, 0.2)", my: 1 }} />

          {teamData?.members.length < 3 && (
            <MenuItem
              onClick={handleCopyInviteLink}
              sx={{
                color: "#9D4EDD",
                "&:hover": {
                  bgcolor: "rgba(157, 78, 221, 0.1)",
                },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <LinkIcon size={16} />
                <Typography variant="body2">Copy Invite Link</Typography>
              </Stack>
            </MenuItem>
          )}

          <MenuItem
            onClick={handleLeaveTeam}
            sx={{
              color: "#f87171",
              "&:hover": {
                bgcolor: "rgba(248, 113, 113, 0.1)",
              },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LogOut size={16} />
              <Typography variant="body2">
                Leave Team
                {teamData?.userRole === "admin" &&
                  teamData?.members.length > 1 && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.75rem",
                        opacity: 0.8,
                        ml: 1,
                      }}
                    >
                      (admin role will transfer)
                    </Typography>
                  )}
              </Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
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
    </>
  );
};

export default TeamDropdown;
