import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const createTeam = (data) => {
  return http.post("/teams/Createteam", data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getAllTeams = () => {
  return http.get("/teams", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getTeamByName = (teamName) => {
  return http.get(`/teams/${teamName}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getTeamById = (teamId) => {
  return http.get(`/teams/${teamId}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getTeamMembers = (teamId) => {
  return http.get(`/team-members/members/${teamId}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getUserTeams = (userId) => {
  return http.get(`/team-members/${userId}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const updateTeamName = (teamId, data) => {
  return http.put(`/teams/${teamId}`, data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const deleteTeam = (teamId) => {
  return http.delete(`/teams/${teamId}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const addTeamMember = (data) => {
  return http.post("/team-members/addMembers", data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const removeTeamMember = (teamMemberId) => {
  return http.delete(`/team-members/removeMember/${teamMemberId}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const updateTeamMemberRole = (data) => {
  return http.put("/team-members/members/ChangeRole", data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const TeamService = {
  createTeam,
  getAllTeams,
  getTeamByName,
  getTeamById,
  getUserTeams,
  getTeamMembers,
  updateTeamName,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
};

export default TeamService;
