
/**
 * A dropdown component for team-related actions and information display
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onCreateTeam - Callback function triggered when creating a new team
 * 
 * @returns {JSX.Element} A dropdown menu component that displays team information and actions
 * 
 * The component handles:
 * - Displaying team name and admin status
 * - Copying team invite links
 * - Team member management (leaving team)
 * - Automatic role reassignment when admin leaves
 * - Loading states and team creation options
 * 
 * Requires authentication context and team data to function properly.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../context/authContext";
import { useTeam } from "../hooks/useTeam";
import TeamService from "../Services/teamService";
import {
  LoadingButton,
  CreateTeamButton,
  SuccessSnackbar,
  TeamDropdownButton,
} from "./team/TeamComponents";
import { TeamDropdownMenu } from "./team/TeamDropdownMenu";

const TeamDropdown = ({ onCreateTeam }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { teamData, loading } = useTeam(user?.user_id);

  const handleClose = () => setAnchorEl(null);

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

      if (membershipToRemove.role === "admin" && teamData.members.length > 1) {
        const newAdmin = teamData.members.find(
          (m) => m.user_id !== user.user_id
        );
        if (newAdmin) {
          await TeamService.updateTeamMemberRole({
            team_member_id: newAdmin.team_member_id,
            role: "admin",
          });
        }
      }

      await TeamService.removeTeamMember(membershipToRemove.team_member_id);
      window.location.reload();
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  if (loading) return <LoadingButton />;
  if (!teamData) return <CreateTeamButton onClick={onCreateTeam} />;

  return (
    <Box>
      <TeamDropdownButton
        teamName={teamData.team.team_name}
        isAdmin={teamData.userRole === "admin"}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />
      <TeamDropdownMenu
        anchorEl={anchorEl}
        onClose={handleClose}
        teamData={teamData}
        onCopyInvite={handleCopyInviteLink}
        onLeaveTeam={handleLeaveTeam}
      />
      <SuccessSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
};

export default TeamDropdown;