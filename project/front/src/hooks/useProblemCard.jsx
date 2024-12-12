/**
 * Custom hook to manage the state and logic for a problem card.
 *
 * @param {Object} problem - The problem object.
 * @param {string} problem.created_by - The ID of the user who created the problem.
 * @returns {Object} - The state and functions related to the problem card.
 * @returns {boolean} isAdmin - Indicates if the current user is an admin.
 * @returns {boolean} isLoading - Indicates if the data is still loading.
 * @returns {string} error - Error message, if any.
 * @returns {Function} setError - Function to set the error message.
 * @returns {Object|null} activeSession - The active session object, if any.
 * @returns {string|null} teamId - The ID of the team the user is part of.
 * @returns {boolean} showSwitchDialog - Indicates if the switch dialog should be shown.
 * @returns {Function} setShowSwitchDialog - Function to set the showSwitchDialog state.
 * @returns {boolean} isCreator - Indicates if the current user is the creator of the problem.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import TeamService from "../Services/teamService";
import SessionTerminalService from "../Services/sessionService";

export const useProblemCard = (problem) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!user) return;

        const teamsResponse = await TeamService.getUserTeams(user.user_id);
        const teamMember = teamsResponse.data.teamMembers?.[0];

        if (teamMember) {
          setTeamId(teamMember.team_id);
          setIsAdmin(teamMember.role === "admin");

          const sessionResponse = await SessionTerminalService.getActiveSession(
            teamMember.team_id
          );
          if (sessionResponse && sessionResponse.length > 0) {
            setActiveSession(sessionResponse[0]);
          }
        }
      } catch (err) {
        console.error("Error checking status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  return {
    isAdmin,
    isLoading,
    error,
    setError,
    activeSession,
    teamId,
    showSwitchDialog,
    setShowSwitchDialog,
    isCreator: user?.user_id === problem.created_by,
  };
};
