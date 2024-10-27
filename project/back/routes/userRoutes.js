const express = require('express');
const router = express.Router();

const {
    registerController,
    getAllUsersController,
    getUserByIdController,
    getUserByUsernameController,
    updateUserController,
    deleteUserController,
} = require('../controllers/userController');



// Route for registering a new user
router.post("/register", registerController);

// Route for getting all users
router.get("/", getAllUsersController);

// Route for getting a user by ID
router.get("/:id", getUserByIdController);

// Route for getting a user by username
router.get("/username/:username", getUserByUsernameController);

// Route for updating a user by ID
router.put("/:id", updateUserController);

// Route for deleting a user by ID
router.delete("/:id", deleteUserController);

module.exports = router;