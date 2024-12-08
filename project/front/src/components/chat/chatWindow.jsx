import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, TextField, IconButton } from "@mui/material";
import { Send, X } from "lucide-react";
import { useAuth } from "../../context/authContext";
import socketService from "../../Services/socketService";
import ChatService from "../../Services/chatService";

const ChatWindow = ({ teamId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  let typingTimeout = null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await ChatService.getTeamMessages(teamId);
        setMessages(response.data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    // Connect to socket if not already connected
    if (!socketService.socket) {
      socketService.connect();
    }

    // Join the chat room
    socketService.joinChatRoom(teamId, user.user_id);
    loadMessages();
    scrollToBottom();
  }, [teamId, user.user_id]);

  useEffect(() => {
    if (!socketService.socket) return;

    socketService.socket.on("newMessage", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          sender_id: message.userId,
          message: message.message,
          User: message.User,
          sent_at: message.timestamp,
        },
      ]);
      scrollToBottom();
    });

    socketService.socket.on("userTyping", ({ userId, userName, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userName);
        } else {
          newSet.delete(userName);
        }
        return newSet;
      });
    });

    return () => {
      socketService.socket.off("newMessage");
      socketService.socket.off("userTyping");
    };
  }, []);

  // Auto scroll on new messages or typing indicators
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const handleTyping = (isTyping) => {
    if (!socketService.socket) return;

    socketService.socket.emit("userTyping", {
      teamId,
      userId: user.user_id,
      userName: user.name || user.username,
      isTyping,
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    // Clear existing timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Only emit typing if there's content
    handleTyping(value.length > 0);

    // Only set timeout to stop typing indicator if the input is empty
    if (value.length === 0) {
      typingTimeout = setTimeout(() => {
        handleTyping(false);
      }, 1000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await ChatService.sendMessage(teamId, newMessage);
      socketService.socket?.emit("chatMessage", {
        teamId,
        message: newMessage,
        userId: user.user_id,
        User: {
          name: user.name,
          username: user.username,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          sender_id: user.user_id,
          message: newMessage,
          User: {
            name: user.name,
            username: user.username,
          },
          sent_at: new Date(),
        },
      ]);

      setNewMessage("");
      // Explicitly stop typing when message is sent
      handleTyping(false);
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;

    return (
      <Box
        sx={{
          p: 1,
          color: "#9D4EDD",
          fontSize: "0.875rem",
          fontStyle: "italic",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            gap: 0.5,
            alignItems: "center",
            "& .dot": {
              width: 4,
              height: 4,
              backgroundColor: "#9D4EDD",
              borderRadius: "50%",
              animation: "typing 1.4s infinite",
              "&:nth-of-type(2)": {
                animationDelay: "0.2s",
              },
              "&:nth-of-type(3)": {
                animationDelay: "0.4s",
              },
            },
            "@keyframes typing": {
              "0%, 60%, 100%": {
                transform: "translateY(0)",
              },
              "30%": {
                transform: "translateY(-4px)",
              },
            },
          }}
        >
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </Box>
        <span>
          {Array.from(typingUsers).join(", ")}{" "}
          {typingUsers.size === 1 ? "is" : "are"} typing...
        </span>
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        height: 400,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1A1626",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 1300,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(157, 78, 221, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "#FAF0CA", fontWeight: 600 }}>
          Team Chat
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#FAF0CA" }}>
          <X size={18} />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#1A1626",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3C096C",
            borderRadius: "3px",
          },
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf:
                msg.sender_id === user.user_id ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <Box
              sx={{
                bgcolor: msg.sender_id === user.user_id ? "#7B2CBF" : "#3C096C",
                p: 1.5,
                borderRadius: 2,
                color: "#FAF0CA",
              }}
            >
              {msg.sender_id !== user.user_id && (
                <Typography
                  variant="caption"
                  sx={{ color: "#9D4EDD", display: "block", mb: 0.5 }}
                >
                  {msg.User?.name || msg.User?.username}
                </Typography>
              )}
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          </Box>
        ))}
        {renderTypingIndicator()}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: "1px solid rgba(157, 78, 221, 0.2)",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={newMessage}
          onChange={handleInputChange}
          onBlur={() => {
            // Only stop typing indicator if input is empty
            if (!newMessage.trim()) {
              handleTyping(false);
            }
          }}
          placeholder="Type a message..."
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#FAF0CA",
              bgcolor: "#240046",
              "& fieldset": { border: "none" },
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            color: "#9D4EDD",
            "&:hover": { color: "#7B2CBF" },
          }}
        >
          <Send size={20} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWindow;
