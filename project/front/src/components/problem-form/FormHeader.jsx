
/**
 * FormHeader component displays a header for the form.
 * It shows "Edit Problem" if the mode is "edit", otherwise it shows "Create New Problem".
 *
 * @param {Object} props - The component props.
 * @param {string} props.mode - The mode of the form, either "edit" or "create".
 * @returns {JSX.Element} The rendered component.
 */
import React from "react";
import { Typography } from "@mui/material";

const FormHeader = ({ mode }) => (
  <Typography variant="h4" component="h1" sx={{ color: "#FAF0CA", mb: 4 }}>
    {mode === "edit" ? "Edit Problem" : "Create New Problem"}
  </Typography>
);

export default FormHeader;
