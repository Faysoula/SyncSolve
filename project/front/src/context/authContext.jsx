
/**
 * @module AuthContext
 * @description Provides authentication context and functionality for the application.
 */

/**
 * @function AuthProvider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 * @returns {JSX.Element} AuthContext Provider component
 * @description Manages authentication state and provides authentication-related functions to child components
 */

/**
 * @function useAuth
 * @returns {Object} Authentication context object
 * @property {Object|null} user - Current authenticated user data
 * @property {Function} login - Function to handle user login
 * @property {Function} logout - Function to handle user logout
 * @property {boolean} loading - Loading state of authentication
 * @throws {Error} If used outside of AuthProvider
 * @description Custom hook to access authentication context
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import UserService from "../Services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        console.log("No token or stored user found");
        setLoading(false);
        return;
      }

      try {
        console.log("Attempting to validate user session");
        const response = await UserService.getCurrentUser();
        console.log("User validation response:", response.data);

        if (response.data.user) {
          console.log("Setting validated user");
          setUser(response.data.user);
          // Update stored user data in case it changed
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          console.log("No user data in response");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
