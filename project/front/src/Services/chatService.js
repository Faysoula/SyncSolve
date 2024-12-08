import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const sendMessage = async (team_id, message) => {
  return http.post(
    "/chat/message",
    { team_id, message },
    { headers: { Authorization: getTokenBearer() } }
  );
};

const getTeamMessages = async (team_id) => {
  return http.get(`/chat/team/${team_id}`, {
    headers: { Authorization: getTokenBearer() },
  });
};

const ChatService = {
  sendMessage,
  getTeamMessages,
};

export default ChatService;
