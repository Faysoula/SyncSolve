import React from "react";
import { TextField } from "@mui/material";
import { styles } from "../../utils/styles";

const TestCaseInput = ({ label, value, onChange }) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    multiline
    rows={2}
    sx={styles.textField}
  />
);

export default TestCaseInput;
