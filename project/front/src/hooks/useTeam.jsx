import { useState, useEffect } from "react";
import TeamService from "../Services/teamService";

export const useTeam = (userId) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const userTeamsResponse = await TeamService.getUserTeams(userId);
      const userTeams = userTeamsResponse.data.teamMembers;

      if (!userTeams || userTeams.length === 0) {
        const allTeamsResponse = await TeamService.getAllTeams();
        const adminTeam = allTeamsResponse.data.teams?.find((team) =>
          team.TeamMembers?.some(
            (member) => member.user_id === userId && member.role === "admin"
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
    if (userId) {
      fetchTeamData();
    }
  }, [userId]);

  return {
    teamData,
    loading,
    activeSession,
    refreshTeamData: fetchTeamData,
  };
};
