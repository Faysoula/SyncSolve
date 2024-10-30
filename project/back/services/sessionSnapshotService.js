const sessionSnapshots = require("../models/sessionSnapshots");
const Session = require("../models/session");
const { getSessionById } = require("./sessionService");

const createSessionSnapshot = async (session_id, code_snapshot) => {
  try {
    const session = await getSessionById(session_id);

    if (!session) {
      throw new Error("Session not found");
    }

    const newSessionSnapshot = await sessionSnapshots.create({
      session_id,
      code_snapshot,
    });
    return newSessionSnapshot;
  } catch (error) {
    throw new Error(`Error creating session snapshot: ${error.message}`);
  }
};

const getSessionSnapshots = async () => {
  try {
    const sessionSnaps = await sessionSnapshots.findAll();
    return sessionSnaps;
  } catch (error) {
    throw new Error(`Error retrieving session snapshots: ${error.message}`);
  }
};

const getSessionSnapshotsBySessionId = async (session_id) => {
  try {
    const sessionSnaps = await sessionSnapshots.findAll({
      where: {
        session_id,
      },
      include: [
        {
          model: Session,
          attributes: ["session_id"],
        },
      ],
    });
    return sessionSnaps;
  } catch (error) {
    throw new Error(`Error retrieving session snapshots: ${error.message}`);
  }
};

const getSessionSnapshotById = async (snapshot_id) => {
  try {
    const sessionSnaps = await sessionSnapshots.findByPk(snapshot_id);
    return sessionSnaps;
  } catch (error) {
    throw new Error(`Error retrieving session snapshot: ${error.message}`);
  }
};

const updateSessionSnapshot = async (snapshot_id, code_snapshot) => {
  try {
    const sessionSnaps = await sessionSnapshots.findByPk(snapshot_id);
    if (!sessionSnaps) {
      throw new Error("Session snapshot not found");
    }
    sessionSnaps.code_snapshot = code_snapshot;
    await sessionSnaps.save();
    return sessionSnaps;
  } catch (error) {
    throw new Error(`Error updating session snapshot: ${error.message}`);
  }
};

const deleteSessionSnapshot = async (snapshot_id) => {
  try {
    const sessionSnaps = await sessionSnapshots.findByPk(snapshot_id);
    if (!sessionSnaps) {
      throw new Error("Session snapshot not found");
    }
    await sessionSnaps.destroy();
    return sessionSnaps;
  } catch (error) {
    throw new Error(`Error deleting session snapshot: ${error.message}`);
  }
};

module.exports = {
  createSessionSnapshot,
  getSessionSnapshots,
  getSessionSnapshotsBySessionId,
  getSessionSnapshotById,
  updateSessionSnapshot,
  deleteSessionSnapshot,
};
