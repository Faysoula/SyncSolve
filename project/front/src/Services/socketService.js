import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.room = null;
  }
  // Connect to the socket.IO server
  connect() {
    this.socket = io("http://localhost:3001", {
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
  // Emit code change event
  joinChatRoom(teamId, userId) {
    if (this.socket) {
      const chatRoom = `team-${teamId}`;
      this.socket.emit("joinRoom", { teamId, userId });
    }
  }
  // Emit typing event
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

  // Emit code change event
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

  // Emit cursor move event
  emitCursorMove(position, userId) {
    if (this.socket && this.room) {
      this.socket.emit("cursorMove", {
        room: this.room,
        position,
        userId,
      });
    }
  }

  // Listen for code change events
  onCodeChange(callback) {
    if (this.socket) {
      this.socket.on("codeChange", callback);
    }
  }

  // Listen for cursor move events
  onCursorMove(callback) {
    if (this.socket) {
      this.socket.on("cursorMove", callback);
    }
  }
  // Listen for user typing events

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on("userJoined", callback);
    }
  }

  // Listen for user typing events
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
