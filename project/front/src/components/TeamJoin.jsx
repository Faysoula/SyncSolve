
/**
 * TeamJoin component handles the team joining process.
 * It validates team membership, handles team transfers, and manages the joining flow.
 * 
 * @component
 * @example
 * return (
 *   <TeamJoin />
 * )
 * 
 * @requires react
 * @requires react-router-dom
 * @requires @mui/material
 * @requires ../context/authContext
 * @requires ../Services/teamService
 * @requires ./team/TeamJoinComponents
 * 
 * @state {boolean} loading - Controls loading state while fetching data
 * @state {string} error - Stores error messages
 * @state {Object} team - Stores target team data
 * @state {boolean} joining - Controls join process state
 * @state {boolean} success - Indicates successful team join
 * @state {Object} currentTeam - Stores user's current team data if exists
 * @state {boolean} showWarningModal - Controls visibility of team transfer warning dialog
 * 
 * @hook {Object} useParams - Extracts teamId from URL parameters
 * @hook {Function} useNavigate - Handles navigation between routes
 * @hook {Object} useAuth - Provides user authentication context
 * 
 * @returns {JSX.Element} A component that displays team joining interface with loading state,
 * error messages, success messages, and team transfer confirmation dialog
 */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../context/authContext";
import TeamService from "../Services/teamService";
import {
  LoadingState,
  TeamJoinCard,
  TeamTransferWarningDialog,
} from "./team/TeamJoinComponents";

const TeamJoin = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [team, setTeam] = useState(null);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    const validateTeam = async () => {
      if (!user) {
        setError("Please sign in to join the team");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all data in parallel
        const [teamResponse, userTeamsResponse] = await Promise.all([
          TeamService.getTeamById(teamId),
          TeamService.getUserTeams(user.user_id),
        ]);

        const teamData = teamResponse.data;
        const userTeams = userTeamsResponse.data.teamMembers;

        // Get current team data if user is in a team
        if (userTeams?.length > 0) {
          const currentTeamResponse = await TeamService.getTeamById(
            userTeams[0].team_id
          );
          setCurrentTeam(currentTeamResponse.data);
        }

        const membersResponse = await TeamService.getTeamMembers(teamId);
        const members = membersResponse.data.teamMembers || [];

        // Validate team membership
        if (members.some((member) => member.user_id === user.user_id)) {
          setError("You are already a member of this team");
        } else if (members.length >= 3) {
          setError("This team is already full");
        } else {
          setTeam(teamData);
        }
      } catch (err) {
        console.error("Team validation error:", err);
        setError("Invalid team invite link");
      } finally {
        setLoading(false);
      }
    };

    validateTeam();
  }, [teamId, user]);

  const handleJoinClick = () => {
    if (currentTeam) {
      setShowWarningModal(true);
    } else {
      handleJoinTeam();
    }
  };

  const handleJoinTeam = async () => {
    try {
      setJoining(true);
      setError("");

      if (currentTeam) {
        const membersResponse = await TeamService.getTeamMembers(
          currentTeam.team_id
        );
        const currentMember = membersResponse.data.teamMembers.find(
          (m) => m.user_id === user.user_id
        );

        if (currentMember) {
          await TeamService.removeTeamMember(currentMember.team_member_id);
        }
      }

      await TeamService.addTeamMember({
        team_id: teamId,
        user_id: user.user_id,
        role: "member",
      });

      setSuccess(true);
      setShowWarningModal(false);

      setTimeout(() => {
        navigate("/problems", { replace: true });
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join team");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0a0118",
        p: 3,
      }}
    >
      <TeamJoinCard
        error={error}
        success={success}
        team={team}
        joining={joining}
        onJoin={handleJoinClick}
        onNavigateBack={() => navigate("/problems")}
      />
      <TeamTransferWarningDialog
        open={showWarningModal}
        currentTeam={currentTeam}
        newTeam={team}
        onCancel={() => setShowWarningModal(false)}
        onConfirm={handleJoinTeam}
        joining={joining}
      />
    </Box>
  );
};

export default TeamJoin;
