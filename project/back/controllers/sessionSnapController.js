const {
  createSessionSnapshot,
  getSessionSnapshots,
  getSessionSnapshotsBySessionId,
  getSessionSnapshotById,
  updateSessionSnapshot,
  deleteSessionSnapshot,
} = require("../services/sessionSnapshotService");

const createSnapshotController = async (req, res) => {
  const { session_id, code_snapshot } = req.body;
  try {
    const newSnapshot = await createSessionSnapshot(session_id, code_snapshot);
    res.status(201).json(newSnapshot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllSnapshotsController = async (req, res) => {
  try {
    const snapshots = await getSessionSnapshots();
    res.status(200).json(snapshots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSnapshotsBySessionIdController = async (req, res) => {
  const session_id = req.params.id;
  try {
    const snapshots = await getSessionSnapshotsBySessionId(session_id);
    res.status(200).json(snapshots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSnapshotByIdController = async (req, res) => {
  const snapshot_id = req.params.id;
  try {
    const snapshot = await getSessionSnapshotById(snapshot_id);
    if (!snapshot) {
      return res.status(404).json({ error: "Snapshot not found" });
    }
    res.status(200).json(snapshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSnapshotController = async (req, res) => {
  const snapshot_id = req.params.id;
  const { code_snapshot } = req.body;
  try {
    const updatedSnapshot = await updateSessionSnapshot(
      snapshot_id,
      code_snapshot
    );
    res.status(200).json(updatedSnapshot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSnapshotController = async (req, res) => {
  const snapshot_id = req.params.id;
  try {
    const deletedSnapshot = await deleteSessionSnapshot(snapshot_id);
    res
      .status(200)
      .json({ message: "Snapshot deleted successfully", deletedSnapshot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSnapshotController,
  getAllSnapshotsController,
  getSnapshotsBySessionIdController,
  getSnapshotByIdController,
  updateSnapshotController,
  deleteSnapshotController,
};
