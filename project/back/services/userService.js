const { Op } = require("sequelize");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const SALT_ROUNDS = 10;

const registerUser = async (username, email, password, name, last_name) => {
  try {
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    if (userExists) {
      if (userExists.username === username) {
        throw new Error("Username already exists");
      }
      if (userExists.email === email) {
        throw new Error("Email already exists");
      }
    }
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username,
      email,
      password_hash: hashedPass,
      name,
      last_name,
    });

    const token = generateToken(user.user_id);
    return { user, token };
  } catch (err) {
    throw new Error(`Error registering user: ${err.message}`);
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new Error("Incorrect password");
    }

    const token = generateToken(user.user_id);
    return { token, user };
  } catch (err) {
    throw new Error(`Error logging in: ${err.message}`);
  }
};

const getCurrentUser = async (user_id) => {
  try {
    const user = await User.findByPk(user_id);
    return user;
  } catch (err) {
    throw new Error(`Error getting current user: ${err.message}`);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (err) {
    throw new Error(`Error getting all users: ${err.message}`);
  }
};

const getUserById = async (user_id) => {
  try {
    const user = await User.findByPk(parseInt(user_id));
    return user;
  } catch (err) {
    throw new Error(`Error getting user by id: ${err.message}`);
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    return user;
  } catch (err) {
    throw new Error(`Error getting user by username: ${err.message}`);
  }
};

const updateUser = async (
  user_id,
  username,
  email,
  password,
  name,
  last_name
) => {
  try {
    const haseshPass = await bcrypt.hash(password, SALT_ROUNDS);

    const [affectedrows] = await User.update(
      {
        username,
        email,
        password: haseshPass,
        name,
        last_name,
      },
      {
        where: {
          user_id,
        },
      }
    );

    if (affectedrows === 0) {
      throw new Error("User not found");
    }

    const updatedUser = await User.findByPk(user_id);
    return updatedUser;
  } catch (err) {
    throw new Error(`Error updating user: ${err.message}`);
  }
};

const deleteUser = async (user_id) => {
  try {
    const toDelete = await User.findByPk(user_id);
    if (!toDelete) {
      throw new Error("User not found");
    }
    await toDelete.destroy();
    return { message: "User deleted successfully" };
  } catch (err) {
    throw new Error(`Error deleting user: ${err.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
};
