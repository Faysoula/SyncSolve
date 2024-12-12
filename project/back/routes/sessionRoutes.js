const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const {
    createSessionController,
    getSessionsController,
    getSessionByIdController,
    getSessionByTeamController,
    endSessionController,
    updateSessionController,
    deleteSessionController,
} = require('../controllers/sessionController');
/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Collaborative coding session management
 * 
 * /api/sessions/CreateSession:
 *   post:
 *     summary: Create a new coding session
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_id
 *               - problem_id
 *             properties:
 *               team_id:
 *                 type: integer
 *               problem_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Session created successfully
 */
// Routes
// Create a new session
/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - team_id
 *         - problem_id
 *       properties:
 *         team_id:
 *           type: integer
 *         problem_id:
 *           type: integer
 */
router.post('/CreateSession', auth, createSessionController);

// Get all sessions
/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all coding sessions
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all coding sessions
 */
router.get('/', auth, getSessionsController);

// Get a session by ID
/**
 * @swagger
 * /api/sessions/session/{id}:
 *   get:
 *     summary: Get a coding session by ID
 *     tags: [Sessions]
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
 *         description: Coding session retrieved successfully
 */
router.get('/session/:id', auth, getSessionByIdController);

// Get all sessions by team
/**
 * @swagger
 * /api/sessions/session/team/{id}:
 *   get:
 *     summary: Get all coding sessions by team ID
 *     tags: [Sessions]
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
 *         description: List of coding sessions retrieved successfully
 */
router.get("/session/team/:id", auth, getSessionByTeamController);

// End a session
/**
 * @swagger
 * /api/sessions/{id}/end:
 *   put:
 *     summary: End a coding session
 *     tags: [Sessions]
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
 *         description: Coding session ended successfully
 */
router.put('/:id/end', auth, endSessionController);

// Update a session
/**
 * @swagger
 * /api/sessions/{id}/updateSesh:
 *   put:
 *     summary: Update a coding session
 *     tags: [Sessions]
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
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       200:
 *         description: Coding session updated successfully
 */
router.put("/:id/updateSesh", auth, updateSessionController);

// Delete a session
/**
 * @swagger
 * /api/sessions/session/{id}/delete:
 *   delete:
 *     summary: Delete a coding session
 *     tags: [Sessions]
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
 *         description: Coding session deleted successfully
 */
router.delete('/session/:id/delete', auth, deleteSessionController);

module.exports = router;