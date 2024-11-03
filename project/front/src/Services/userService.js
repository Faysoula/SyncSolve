import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const register = async(data) => {
  const res = await http.post("/users/register", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res;
};

const login = async (data) => {
  const res = await http.post("/users/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res;
};

const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  return http.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
  getCurrentUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
};

export default UserService;
