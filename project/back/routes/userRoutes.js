const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    registerController,
    loginController,
    getCurrentUserController,
    getAllUsersController,
    getUserByIdController,
    getUserByUsernameController,
    updateUserController,
    deleteUserController,
} = require('../controllers/userController');



// Route for registering a new user
router.post("/register", registerController);

// Route for logging in a user
router.post("/login", loginController);

// Route for getting the current user
router.get("/me", auth, getCurrentUserController);

// Route for getting all users
router.get("/", auth ,getAllUsersController);

// Route for getting a user by ID
router.get("/:id", auth, getUserByIdController);

// Route for getting a user by username
router.get("/username/:username", auth, getUserByUsernameController);

// Route for updating a user by ID
router.put("/:id", auth, updateUserController);

// Route for deleting a user by ID
router.delete("/:id", auth ,deleteUserController);

module.exports = router;