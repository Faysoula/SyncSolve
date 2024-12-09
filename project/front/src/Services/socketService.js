import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.room = null;
  }

  connect() {
    this.socket = io("http://192.168.10.208:3001", {
      transports: ["websocket"],
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("connected to socket.IO server");
    });

    this.socket.on("disconnect", () => {
      console.log("disconnected from socket.IO server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  joinRoom(sessionId, problemId, userId) {
    this.room = `${sessionId}-${problemId}`;
    this.socket.emit("joinRoom", { sessionId, problemId, userId });
  }

  joinChatRoom(teamId, userId) {
    if (this.socket) {
      const chatRoom = `team-${teamId}`;
      this.socket.emit("joinRoom", { teamId, userId });
    }
  }
  emitTyping(teamId, userId, userName, isTyping) {
    if (this.socket) {
      this.socket.emit("userTyping", {
        teamId,
        userId,
        userName,
        isTyping,
      });
    }
  }

  emitCodeChange(code, language, userId, position) {
    if (this.socket && this.room) {
      this.socket.emit("codeChange", {
        room: this.room,
        code,
        language,
        userId,
        cursorPosition: {
          lineNumber: position.lineNumber,
          column: position.column,
        },
      });
    }
  }

  emitCursorMove(position, userId) {
    if (this.socket && this.room) {
      this.socket.emit("cursorMove", {
        room: this.room,
        position,
        userId,
      });
    }
  }

  onCodeChange(callback) {
    if (this.socket) {
      this.socket.on("codeChange", callback);
    }
  }

  onCursorMove(callback) {
    if (this.socket) {
      this.socket.on("cursorMove", callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on("userJoined", callback);
    }
  }

  disconnect() {
    if (this.socket) {
      // Remove all listeners before disconnecting
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.room = null;
    }
  }
}

export default new SocketService();
