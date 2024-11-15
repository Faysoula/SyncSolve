import React from "react";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";

const AddTestCaseButton = ({ onClick }) => (
  <Button
    startIcon={<Plus />}
    onClick={onClick}
    variant="outlined"
    sx={{
      color: "#FAF0CA",
      borderColor: "#5A189A",
      "&:hover": { borderColor: "#7B2CBF", bgcolor: "#240046" },
    }}
  >
    Add Test Case
  </Button>
);

export default AddTestCaseButton;
