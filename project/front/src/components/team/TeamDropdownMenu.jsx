import React from "react";
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import { LogOut, Crown, Link as LinkIcon } from "lucide-react";

export const TeamDropdownMenu = ({
  anchorEl,
  onClose,
  teamData,
  onCopyInvite,
  onLeaveTeam,
}) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
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
            {member.User?.name?.charAt(0) || member.User?.username?.charAt(0)}
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
        onClick={onCopyInvite}
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
      onClick={onLeaveTeam}
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
          {teamData?.userRole === "admin" && teamData?.members.length > 1 && (
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
);