import React from "react";
import { Typography } from "@mui/material";

const FormHeader = ({ mode }) => (
  <Typography variant="h4" component="h1" sx={{ color: "#FAF0CA", mb: 4 }}>
    {mode === "edit" ? "Edit Problem" : "Create New Problem"}
  </Typography>
);

export default FormHeader;
