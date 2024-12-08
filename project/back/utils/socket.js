// utils/socket.js
const { Server } = require("socket.io");

//hi Dr im new to sockets so if this is wrong please spare me :D

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ sessionId, problemId, userId, teamId }) => {
      const room = `${sessionId}-${problemId}`;
      const chatRoom = `team-${teamId}`;
      socket.join(room);
      socket.join(chatRoom);
      console.log(
        `User ${userId} joined room ${room} and chat room ${chatRoom}`
      );

      socket.to(room).emit("userJoined", {
        userId,
        socketId: socket.id,
      });
    });
    socket.on("chatMessage", ({ teamId, message, userId, User }) => {
      const chatRoom = `team-${teamId}`;
      socket.to(chatRoom).emit("newMessage", {
        message,
        userId,
        User,
        timestamp: new Date(),
      });
    });

    // Handle code changes
    socket.on("codeChange", ({ room, code, language, userId }) => {
      socket.to(room).emit("codeChange", {
        code,
        language,
        userId,
      });
    });

    // Handle cursor position updates
    socket.on("cursorMove", ({ room, position, userId }) => {
      socket.to(room).emit("cursorMove", {
        position,
        userId,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
