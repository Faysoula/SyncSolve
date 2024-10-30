const express = require("express");
const {
  createSnapshotController,
  getAllSnapshotsController,
  getSnapshotsBySessionIdController,
  getSnapshotByIdController,
  updateSnapshotController,
  deleteSnapshotController,
} = require("../controllers/sessionSnapController");

const router = express.Router();

// Route to create a new session snapshot
router.post("/createSnapshot", createSnapshotController);

// Route to get all session snapshots
router.get("/", getAllSnapshotsController);

// Route to get all snapshots by session ID
router.get("/session/:id", getSnapshotsBySessionIdController);

// Route to get a specific snapshot by snapshot ID
router.get("/:id", getSnapshotByIdController);

// Route to update a snapshot by snapshot ID
router.put("/:id", updateSnapshotController);

// Route to delete a snapshot by snapshot ID
router.delete("/:id", deleteSnapshotController);

module.exports = router;
