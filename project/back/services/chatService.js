const Chat = require("../models/Chat");
const User = require("../models/user");

// Create a new message in the chat
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

/**
 * Retrieves all messages for a specific team, including sender's information
 * @async
 * @param {number} team_id - The ID of the team whose messages are to be retrieved
 * @returns {Promise<Array>} Array of message objects with associated user details
 * @throws {Error} If there's an error retrieving the messages from the database
 */
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
