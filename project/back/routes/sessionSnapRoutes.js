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
/**
 * @swagger
 * tags:
 *   name: Session Snapshots
 *   description: Code snapshot management for sessions
 * 
 * /api/snapshots/createSnapshot:
 *   post:
 *     summary: Create a code snapshot
 *     tags: [Session Snapshots]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - code_snapshot
 *             properties:
 *               session_id:
 *                 type: integer
 *               code_snapshot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Snapshot created successfully
 */
// Route to create a new session snapshot
router.post("/createSnapshot", createSnapshotController);

// Route to get all session snapshots
/**
 * @swagger
 * /api/snapshots:
 *   get:
 *     summary: Get all code snapshots
 *     tags: [Session Snapshots]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Snapshots retrieved successfully
 */
router.get("/", getAllSnapshotsController);

// Route to get all snapshots by session ID
/**
 * @swagger
 * /api/snapshots/session/{session_id}:
 *   get:
 *     summary: Get all code snapshots by session ID
 *     tags: [Session Snapshots]
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/session/:id", getSnapshotsBySessionIdController);

// Route to get a specific snapshot by snapshot ID
/**
 * @swagger
 * /api/snapshots/{id}:
 *   get:
 *     summary: Get a code snapshot by snapshot ID
 *     tags: [Session Snapshots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", getSnapshotByIdController);

// Route to update a snapshot by snapshot ID
/**
 * @swagger
 * /api/snapshots/{id}:
 *   put:
 *     summary: Update a code snapshot
 *     tags: [Session Snapshots]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code_snapshot
 *             properties:
 *               code_snapshot:
 *                 type: string
 *     responses:
 *       200:
 *         description: Snapshot updated successfully
 */
router.put("/:id", updateSnapshotController);

// Route to delete a snapshot by snapshot ID
/**
 * @swagger
 * /api/snapshots/{id}:
 *   delete:
 *     summary: Delete a code snapshot
 *     tags: [Session Snapshots]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Snapshot deleted successfully
 */
router.delete("/:id", deleteSnapshotController);

module.exports = router;
