/**
 * SignIn component for user authentication.
 *
 * @component
 * @example
 * return (
 *   <SignIn />
 * )
 *
 * @description
 * Renders a sign-in form with email and password fields.
 * Features include:
 * - Email validation
 * - Password validation
 * - Loading state during form submission
 * - Error handling and display
 * - Success message and redirect after successful login
 * - Navigation to registration page
 *
 * @returns {JSX.Element} A sign-in form with email and password inputs, submit button,
 *                       and link to registration page
 *
 * @uses {useNavigate} For navigation after successful login
 * @uses {useAuth} For handling user authentication context
 * @uses {useState} For managing component state
 * @uses {useForm} Custom hook for form handling
 * @uses {UserService} For making login API calls
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Alert, Stack, Button } from "@mui/material";
import { EmailOutlined, LockOutlined, Coffee } from "@mui/icons-material";
import AuthLayout from "./common/AuthLayout";
import FormTextField from "./common/FormTextField";
import LoadingButton from "./common/LoadingButton";
import useForm from "../hooks/useForm";
import UserService from "../Services/userService";
import { useAuth } from "../context/authContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const initialState = {
    email: "",
    password: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const { formData, errors, handleChange, validateForm } = useForm(
    initialState,
    validate
  );

  // In SignIn component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await UserService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Coffee sx={{ color: "#FAF0CA", fontSize: 32 }} />
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: "#FAF0CA" }}
        >
          Welcome Back
        </Typography>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Login successful! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormTextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<EmailOutlined />}
          />

          <FormTextField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<LockOutlined />}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isLoading}
          >
            Sign In
          </LoadingButton>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}
          >
            <Typography variant="body2" sx={{ color: "#FAF0CA", opacity: 0.9 }}>
              WHAT IM NOT A MEMBER YET?!!
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#FAF0CA",
                textTransform: "none",
                fontWeight: 600,
                p: 0,
                minWidth: "700",
                "&:hover": { backgroundColor: "transparent", color: "#E0B1CB" },
              }}
              onClick={() => navigate("/Register")}
            >
              Sign Up
            </Button>
          </Box>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
