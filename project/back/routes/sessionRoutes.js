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

// Routes
// Create a new session
router.post('/CreateSession', auth, createSessionController);

// Get all sessions
router.get('/', auth, getSessionsController);

// Get a session by ID
router.get('/session/:id', auth, getSessionByIdController);

// Get all sessions by team
router.get("/session/team/:id", auth, getSessionByTeamController);

// End a session
router.put('/:id/end', auth, endSessionController);

// Update a session
router.put("/:id/updateSesh", auth, updateSessionController);

// Delete a session
router.delete('/session/:id/delete', auth, deleteSessionController);

module.exports = router;