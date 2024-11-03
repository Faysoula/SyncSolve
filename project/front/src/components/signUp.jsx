// src/components/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Alert, Stack, Box, Button } from "@mui/material";
import {
  PersonOutline,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import AuthLayout from "./common/AuthLayout";
import FormTextField from "./common/FormTextField";
import LoadingButton from "./common/LoadingButton";
import useForm from "../hooks/useForm";
import UserService from "../Services/userService";
import { useAuth } from "../context/authContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };

  const validate = (values) => {
    const errors = {};

    // Username validation
    if (!values.username.trim()) {
      errors.username = "Username is required";
    } else if (values.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // First name validation
    if (!values.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Last name validation
    if (!values.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    return errors;
  };

  const { formData, errors, handleChange, validateForm, setFormData } = useForm(
    initialState,
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await UserService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.firstName,
        last_name: formData.lastName,
      });

      login(response.data.user, response.data.token);
      setShowSuccess(true);

      // Reset form
      setFormData(initialState);

      // Redirect after successful registration
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          color: "#FAF0CA",
          mb: 1,
        }}
      >
        Create Account
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#FAF0CA",
          opacity: 0.8,
          mb: 4,
        }}
      >
        Join us and start your coding journey
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful! Redirecting to login...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
          >
            <FormTextField
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              icon={<PersonOutline />}
            />

            <FormTextField
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              icon={<PersonOutline />}
            />
          </Stack>

          <FormTextField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={<PersonOutline />}
          />

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

          <FormTextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<LockOutlined />}
            showPassword={showConfirmPassword}
            togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isLoading}
          >
            Sign Up
          </LoadingButton>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}
          >
            <Typography variant="body2" sx={{ color: "#FAF0CA", opacity: 0.9 }}>
              Already an exhausted dev?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#FAF0CA",
                textTransform: "none",
                fontWeight: 600,
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#E0B1CB",
                },
              }}
              onClick={() => navigate("/signin")}
            >
              Sign in
            </Button>
          </Box>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
