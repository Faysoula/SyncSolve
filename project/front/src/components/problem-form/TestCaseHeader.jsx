import React from "react";
import { Stack, Typography, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";

const TestCaseHeader = ({ index, onRemove }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography sx={{ color: "#FAF0CA" }}>Test Case #{index + 1}</Typography>
    <IconButton onClick={onRemove} sx={{ color: "#ff4444" }}>
      <Trash2 size={20} />
    </IconButton>
  </Stack>
);

export default TestCaseHeader;
