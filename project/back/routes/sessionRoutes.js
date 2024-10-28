const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const {
    createSessionController,
    getSessionsController,
    getSessionByIdController,
    getSessionByTeamController,
    endSessionController,
    deleteSessionController,
} = require('../controllers/sessionController');

//
router.post('/CreateSession', auth, createSessionController);

router.get('/', auth, getSessionsController);

router.get('/session/:id', auth, getSessionByIdController);

router.get("/session/team/:id", auth, getSessionByTeamController);

router.put('/:id/end', auth, endSessionController);

router.delete('/session/:id/delete', auth, deleteSessionController);

module.exports = router;