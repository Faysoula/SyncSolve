// components/problem-form/TestCaseInput.jsx
import React from "react";
import { TextField } from "@mui/material";
import { styles } from "../../utils/styles";

const TestCaseInput = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      multiline
      rows={2}
      sx={styles.textField}
      InputProps={{
        sx: {
          color: "#FAF0CA",
        },
      }}
    />
  );
};

export default TestCaseInput;
