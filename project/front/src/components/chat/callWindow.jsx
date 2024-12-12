
/**
 * A component that manages a voice call window with WebRTC functionality.
 * Handles peer connections, audio streams, and participant management in a team call session.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.teamId - The ID of the team the call belongs to
 * @param {string} props.sessionId - The unique identifier for the call session
 * @param {Function} props.onClose - Callback function to handle closing the call window
 *
 * @returns {JSX.Element} A call window interface with mute/unmute and hang up controls
 *
 * Features:
 * - Real-time audio communication using WebRTC
 * - Participant management
 * - Mute/unmute functionality
 * - ICE candidate negotiation
 * - Automatic cleanup on component unmount
 * - Error handling for media devices
 *
 * @example
 * <CallWindow 
 *   teamId="team123"
 *   sessionId="session456"
 *   onClose={() => handleCloseCall()}
 * />
 */
import React, { useState, useEffect, useRef } from "react";
import { IconButton, Box, Typography, Stack, Alert } from "@mui/material";
import { PhoneOff, Mic, MicOff, Users } from "lucide-react";
import { useAuth } from "../../context/authContext";
import socketService from "../../Services/socketService";

const CallWindow = ({ teamId, sessionId, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState(new Set());
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const audioElementsRef = useRef(new Map());

  const createPeerConnection = (peerId) => {
    if (peerConnectionsRef.current.has(peerId)) {
      return peerConnectionsRef.current.get(peerId);
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    // Log state changes for debugging
    peerConnection.onsignalingstatechange = () => {
      console.log(
        `Signaling state for ${peerId}:`,
        peerConnection.signalingState
      );
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        `ICE state for ${peerId}:`,
        peerConnection.iceConnectionState
      );
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    peerConnection.ontrack = (event) => {
      console.log(`Received track from ${peerId}`);
      const [remoteStream] = event.streams;
      const audioElement = new Audio();
      audioElement.srcObject = remoteStream;
      audioElement.autoplay = true;
      audioElement.playsInline = true;
      document.body.appendChild(audioElement);

      audioElement.onloadedmetadata = () => {
        console.log(`Audio element ready for peer ${peerId}`);
        audioElement
          .play()
          .catch((err) => console.error("Audio play error:", err));
      };

      audioElementsRef.current.set(peerId, audioElement);
    };

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socketService.socket?.emit("call:ice-candidate", { peerId, candidate });
      }
    };

    peerConnectionsRef.current.set(peerId, peerConnection);
    return peerConnection;
  };

  const setupSocketListeners = () => {
    if (!socketService.socket) return;

    socketService.socket.on(
      "call:new-peer",
      async ({ peerId, userData, shouldCreateOffer }) => {
        try {
          console.log("New peer joined:", peerId, shouldCreateOffer);
          const peerConnection = createPeerConnection(peerId);

          if (shouldCreateOffer && peerConnection.signalingState === "stable") {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socketService.socket.emit("call:offer", { peerId, offer });
          }
        } catch (err) {
          console.error("Error handling new peer:", err);
        }
      }
    );

    socketService.socket.on("call:offer", async ({ peerId, offer }) => {
      try {
        const peerConnection = createPeerConnection(peerId);

        if (peerConnection.signalingState === "stable") {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socketService.socket.emit("call:answer", { peerId, answer });
        }
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socketService.socket.on("call:answer", async ({ peerId, answer }) => {
      try {
        const peerConnection = peerConnectionsRef.current.get(peerId);
        if (
          peerConnection &&
          peerConnection.signalingState === "have-local-offer"
        ) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    socketService.socket.on(
      "call:ice-candidate",
      async ({ peerId, candidate }) => {
        try {
          const peerConnection = peerConnectionsRef.current.get(peerId);
          if (
            peerConnection &&
            peerConnection.remoteDescription &&
            peerConnection.signalingState !== "closed"
          ) {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    );

    socketService.socket.on(
      "call:participant-list",
      ({ participants: newParticipants }) => {
        console.log("Updated participant list:", newParticipants);
        setParticipants(new Set(newParticipants));
      }
    );
  };

  useEffect(() => {
    const initializeCall = async () => {
      try {
        if (!socketService.socket) {
          socketService.connect();
        }

        console.log("Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            channelCount: 1,
          },
        });

        localStreamRef.current = stream;
        console.log("Microphone access granted");

        // Setup socket listeners
        setupSocketListeners();

        // Join the call room
        socketService.socket?.emit("call:join", {
          teamId,
          userId: user.user_id,
          userData: { name: user.name || user.username },
        });
      } catch (err) {
        console.error("Call initialization error:", err);
        setError("Could not access microphone: " + err.message);
      }
    };

    initializeCall();

    return () => {
      cleanupCall();
    };
  }, [teamId, user.user_id]);

  const cleanupCall = () => {
    console.log("Cleaning up call...");

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track.id);
      });
    }

    // Close peer connections
    peerConnectionsRef.current.forEach((pc, peerId) => {
      pc.close();
      console.log("Closed peer connection:", peerId);
    });

    // Remove audio elements
    audioElementsRef.current.forEach((audio, peerId) => {
      audio.remove();
      console.log("Removed audio element:", peerId);
    });

    // Clear refs
    localStreamRef.current = null;
    peerConnectionsRef.current.clear();
    audioElementsRef.current.clear();

    // Leave call
    socketService.socket?.emit("call:leave", { teamId });
    console.log("Left call room");

    // Remove socket listeners
    if (socketService.socket) {
      socketService.socket.off("call:new-peer");
      socketService.socket.off("call:offer");
      socketService.socket.off("call:answer");
      socketService.socket.off("call:ice-candidate");
      socketService.socket.off("call:participant-list");
      console.log("Removed socket listeners");
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log("Microphone muted:", !audioTrack.enabled);
      }
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        right: 20,
        bgcolor: "#1A1626",
        borderRadius: 2,
        p: 2,
        width: "300px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1300,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Users size={20} color="#FAF0CA" />
          <Typography sx={{ color: "#FAF0CA" }}>
            Call ({participants.size} participants)
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={toggleMute} sx={{ color: "#FAF0CA" }}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: "#f87171" }}>
            <PhoneOff size={20} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CallWindow;
