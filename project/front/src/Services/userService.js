import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const register = (data) => {
  return http.post("/users/register", data);
};

const login = (data) => {
  return http.post("/users/login", data);
};

const getAllUsers = () => {
  return http.get("/users", {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getUserById = (id) => {
  return http.get(`/users/${id}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const getUserByUsername = (username) => {
  return http.get(`/users/username/${username}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const updateUser = (id, data) => {
  return http.put(`/users/${id}`, data, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const deleteUser = (id) => {
  return http.delete(`/users/${id}`, {
    headers: {
      Authorization: getTokenBearer(),
    },
  });
};

const UserService = {
  register,
  login,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
};

export default UserService;
