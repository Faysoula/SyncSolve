const Chat = require("../models/Chat");
const User = require("../models/user");

const createMessage = async (team_id, sender_id, message) => {
  try {
    const chat = await Chat.create({
      team_id,
      sender_id,
      message,
    });
    return chat;
  } catch (err) {
    throw new Error(`Error creating message: ${err.message}`);
  }
};

const getTeamMessages = async (team_id) => {
  try {
    const messages = await Chat.findAll({
      where: { team_id },
      include: [
        {
          model: User,
          attributes: ["username", "name", "last_name"],
        },
      ],
      order: [["sent_at", "ASC"]],
    });
    return messages;
  } catch (err) {
    throw new Error(`Error getting team messages: ${err.message}`);
  }
};

module.exports = {
  createMessage,
  getTeamMessages,
};
