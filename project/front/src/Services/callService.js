import socketService from "./socketService";

// CallService class to handle WebRTC calls
class CallService {
  constructor() {
    this.peerConnections = new Map();
    this.pendingCandidates = new Map();
    const configuration = {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
        {
          urls: "turn:numb.viagenie.ca",
          username: "webrtc@live.com",
          credential: "muazkh",
        },
        {
          urls: "turn:turn.anyfirewall.com:443?transport=tcp",
          username: "webrtc",
          credential: "webrtc",
        },
      ],
      iceCandidatePoolSize: 10,
    };
  }

  // Create a new peer connection
  async createPeerConnection(peerId, localStream) {
    try {
      const peerConnection = new RTCPeerConnection(this.configuration);

      // Add local tracks to the connection
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      // Store any candidates that arrived before peer connection was created
      const pendingCandidates = this.pendingCandidates.get(peerId) || [];
      pendingCandidates.forEach((candidate) => {
        peerConnection.addIceCandidate(candidate).catch(console.error);
      });
      this.pendingCandidates.delete(peerId);

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketService.socket?.emit("call:ice-candidate", {
            peerId,
            candidate: event.candidate,
          });
        }
      };

      this.peerConnections.set(peerId, peerConnection);
      return peerConnection;
    } catch (err) {
      console.error("Error creating peer connection:", err);
      throw err;
    }
  }

  // Create an offer to send to a peer 
  async createOffer(peerId, localStream) {
    try {
      const peerConnection = await this.createPeerConnection(
        peerId,
        localStream
      );
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      return { peerConnection, offer };
    } catch (err) {
      console.error("Error creating offer:", err);
      throw err;
    }
  }

  // Handle an offer from a peer
  async handleOffer(peerId, offer, localStream) {
    try {
      const peerConnection = await this.createPeerConnection(
        peerId,
        localStream
      );
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      return { peerConnection, answer };
    } catch (err) {
      console.error("Error handling offer:", err);
      throw err;
    }
  }

  // Handle an answer from a peer
  async handleAnswer(peerId, answer) {
    try {
      const peerConnection = this.peerConnections.get(peerId);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    } catch (err) {
      console.error("Error handling answer:", err);
      throw err;
    }
  }

  // Handle ICE
  async handleIceCandidate(peerId, candidate) {
    try {
      const peerConnection = this.peerConnections.get(peerId);
      if (peerConnection && peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        // Store candidate for later if peer connection isn't ready
        if (!this.pendingCandidates.has(peerId)) {
          this.pendingCandidates.set(peerId, []);
        }
        this.pendingCandidates.get(peerId).push(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.error("Error handling ICE candidate:", err);
      throw err;
    }
  }

  // Close a connection
  closeConnection(peerId) {
    const peerConnection = this.peerConnections.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(peerId);
      this.pendingCandidates.delete(peerId);
    }
  }

  // Close all connections
  closeAllConnections() {
    this.peerConnections.forEach((connection, peerId) => {
      this.closeConnection(peerId);
    });
  }
}

export default new CallService();
