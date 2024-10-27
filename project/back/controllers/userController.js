const {
  registerUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
} = require("../services/userService");

const registerController = async (req, res) => {
  const { username, email, password, name, last_name } = req.body;

  try {
    const user = await registerUser(username, email, password, name, last_name);
    res.status(201).json({ message: "User registered successfully",user });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error getting all users:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getUserByIdController = async (req, res) => {
  const user_id = req.params.id;
  try {
    const user = await getUserById(user_id);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error getting user by id:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getUserByUsernameController = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    res.status(200).json({user});
  } catch (err) {
    console.error("Error getting user by username:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateUserController = async (req, res) => {
  const { username, email, name, last_name } = req.body;
  const user_id = req.params.id;

  if (!user_id) {
    return res.status(400).json({ message: "missing user id" });
  }

  try {
    const newUser = await updateUser(user_id, username, email, name, last_name);
    return res.status(200).json({message:"user updated successfully" ,newUser});
  } catch (err) {
    console.error("error updating user", err.message);
    res.status(500).json({ error: err?.message });
  }
};

const deleteUserController = async (req, res) => {
    const user_id = req.params.id;
    try {
        const user = await deleteUser(user_id);
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
  registerController,
  getAllUsersController,
  getUserByIdController,
  getUserByUsernameController,
  updateUserController,
};
