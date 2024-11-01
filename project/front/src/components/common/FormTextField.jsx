import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormTextField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  icon,
  showPassword,
  togglePassword,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        sx={{
          "& .MuiOutlinedInput-root": {
            paddingLeft: "14px",
          },
        }}
        InputProps={{
          startAdornment: icon && (
            <Box component="span" sx={{ mr: 1, display: "flex" }}>
              {icon}
            </Box>
          ),
          ...(type === "password" &&
            togglePassword && {
              endAdornment: (
                <IconButton
                  onClick={togglePassword}
                  edge="end"
                  sx={{ color: "#FAF0CA" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }),
        }}
      />
    </Box>
  );
};

export default FormTextField;
