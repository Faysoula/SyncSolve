// utils/socket.js
const { Server } = require("socket.io");
const activeRooms = new Map();
const activeCalls = new Map();

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

    socket.on("userTyping", ({ teamId, userId, userName, isTyping }) => {
      const chatRoom = `team-${teamId}`;
      socket.to(chatRoom).emit("userTyping", {
        userId,
        userName,
        isTyping,
      });
    });

    // Handle call events
    socket.on("call:start", ({ teamId, sessionId, initiatorId }) => {
      const room = `call-${teamId}`;
      socket.join(room);
      activeRooms.set(teamId, {
        initiatorId,
        participants: new Set([initiatorId]),
      });

      // Notify ALL team members (not just those in the call room)
      io.to(`team-${teamId}`).emit("call:started", {
        initiatorId,
        active: true,
      });
    });

    socket.on("call:join", ({ teamId, userId, userData }) => {
      const room = `call-${teamId}`;
      socket.join(room);
      socket.userId = userId;

      // Get all participants EXCEPT the joining user
      const participants = Array.from(
        io.sockets.adapter.rooms.get(room) || []
      ).filter((id) => id !== socket.id);

      if (participants.length > 0) {
        // New peer joins - notify ONLY THE FIRST participant to create an offer
        io.to(participants[0]).emit("call:new-peer", {
          peerId: socket.id,
          userData,
          shouldCreateOffer: true,
        });
      }

      // Update participant list
      io.to(room).emit("call:participant-list", {
        participants: Array.from(io.sockets.adapter.rooms.get(room) || []),
      });
    });
    socket.on("call:offer", ({ peerId, offer }) => {
      socket.to(peerId).emit("call:offer", {
        offer,
        peerId: socket.id,
      });
    });

    socket.on("call:end", ({ teamId }) => {
      const room = `call-${teamId}`;
      const activeRoom = activeRooms.get(teamId);

      if (activeRoom) {
        // Notify everyone in the team that call ended
        io.to(`team-${teamId}`).emit("call:ended");
        activeRooms.delete(teamId);
      }
    });
    socket.on("call:answer", ({ peerId, answer }) => {
      socket.to(peerId).emit("call:answer", {
        answer,
        peerId: socket.id,
      });
    });

    socket.on("call:ice-candidate", ({ peerId, candidate }) => {
      socket.to(peerId).emit("call:ice-candidate", {
        candidate,
        peerId: socket.id,
      });
    });

    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room.startsWith("call-")) {
          const teamId = room.split("-")[1];
          const activeRoom = activeRooms.get(teamId);

          if (activeRoom && socket.userId) {
            activeRoom.participants.delete(socket.userId);

            if (activeRoom.participants.size === 0) {
              // Last person left, end the call
              io.to(`team-${teamId}`).emit("call:ended");
              activeRooms.delete(teamId);
            } else {
              // Update participant list for remaining members
              io.to(room).emit("call:participant-list", {
                participants: Array.from(activeRoom.participants),
              });
            }
          }
        }
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
