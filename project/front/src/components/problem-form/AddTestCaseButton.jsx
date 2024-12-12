
/**
 * AddTestCaseButton component renders a button with a plus icon that triggers a provided onClick handler.
 *
 * @component
 * @example
 * const handleClick = () => { console.log('Button clicked'); };
 * return <AddTestCaseButton onClick={handleClick} />;
 *
 * @param {Object} props - Component props
 * @param {function} props.onClick - Function to be called when the button is clicked
 *
 * @returns {JSX.Element} A button component with custom styles and an icon
 */
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
