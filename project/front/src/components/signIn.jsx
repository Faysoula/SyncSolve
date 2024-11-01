import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box,Typography, Alert, Stack } from "@mui/material";
import { EmailOutlined, LockOutlined, Coffee } from "@mui/icons-material";
import AuthLayout from "./common/AuthLayout";
import FormTextField from "./common/FormTextField";
import LoadingButton from "./common/LoadingButton";
import useForm from "../hooks/useForm";
import UserService from "../Services/userService";

const SignIn = () => {
  const navigate = useNavigate();
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

      localStorage.setItem("token", response.data.token);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
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
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
