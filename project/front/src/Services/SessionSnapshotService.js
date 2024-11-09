import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const createSnapshot = async (sessionId, codeSnapshot) => {
  try {
    const response = await http.post(
      "/snapshots/createSnapshot",
      {
        session_id: sessionId,
        code_snapshot: codeSnapshot,
      },
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to save code snapshot: ${error.message}`);
  }
};

const getSnapshotsBySessionId = async (sessionId) => {
  try {
    const response = await http.get(`/snapshots/session/${sessionId}`, {
      headers: {
        Authorization: getTokenBearer(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get snapshots: ${error.message}`);
  }
};

const SessionSnapshotService = {
  createSnapshot,
  getSnapshotsBySessionId,
};

export default SessionSnapshotService;
