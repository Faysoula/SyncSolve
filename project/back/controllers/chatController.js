const { createMessage, getTeamMessages } = require("../services/chatService");

/**
 * Create a new message in the chat
 */
const createMessageController = async (req, res) => {
  const { team_id, message } = req.body;
  const sender_id = req.user.user_id;

  try {
    const chat = await createMessage(team_id, sender_id, message);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// gets all messages for a team
const getTeamMessagesController = async (req, res) => {
  const { team_id } = req.params;

  try {
    const messages = await getTeamMessages(team_id);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMessageController,
  getTeamMessagesController,
};
