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

    // Join a room based on session and problem
    socket.on("joinRoom", ({ sessionId, problemId, userId }) => {
      const room = `${sessionId}-${problemId}`;
      socket.join(room);
      console.log(`User ${userId} joined room ${room}`);

      // Notify others in the room
      socket.to(room).emit("userJoined", {
        userId,
        socketId: socket.id,
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
