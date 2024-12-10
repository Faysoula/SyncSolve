import React, { useState, useEffect } from "react";
import { IconButton, Badge } from "@mui/material";
import { Phone } from "lucide-react";
import { useAuth } from "../../context/authContext";
import CallWindow from "./callWindow";
import socketService from "../../Services/socketService";

export const CallButton = ({ teamId, sessionId }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!socketService.socket) {
      socketService.connect();
    }

    socketService.socket.emit("joinRoom", {
      sessionId,
      problemId: null,
      userId: user.user_id,
      teamId,
    });

    socketService.socket.on("call:started", ({ initiatorId }) => {
      if (initiatorId !== user.user_id) {
        setIncomingCall(true);
      }
    });

    socketService.socket.on("call:ended", () => {
      setIncomingCall(false);
      setIsCallActive(false);
    });

    return () => {
      if (socketService.socket) {
        socketService.socket.off("call:started");
        socketService.socket.off("call:ended");
      }
    };
  }, [user.user_id, teamId, sessionId]);

  const startCall = () => {
    setIsCallActive(true);
    socketService.socket?.emit("call:start", {
      teamId,
      sessionId,
      initiatorId: user.user_id,
    });
  };

  const joinCall = () => {
    setIsCallActive(true);
    setIncomingCall(false);
  };

  return (
    <>
      <Badge
        color="error"
        variant="dot"
        invisible={!incomingCall}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#4ade80",
          },
        }}
      >
        <IconButton
          onClick={incomingCall ? joinCall : startCall}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            bgcolor: incomingCall ? "#4ade80" : "#7B2CBF",
            color: "#FAF0CA",
            "&:hover": {
              bgcolor: incomingCall ? "#22c55e" : "#9D4EDD",
            },
            width: 48,
            height: 48,
          }}
        >
          <Phone size={24} />
        </IconButton>
      </Badge>

      {isCallActive && (
        <CallWindow
          teamId={teamId}
          sessionId={sessionId}
          onClose={() => {
            setIsCallActive(false);
            socketService.socket?.emit("call:end", { teamId, sessionId });
          }}
        />
      )}
    </>
  );
};

export default CallButton;
