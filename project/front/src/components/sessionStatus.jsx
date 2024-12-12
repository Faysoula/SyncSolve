
/**
 * A component that displays a session status chip/tag.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.sessionId - The ID of the current session
 * @param {string} props.problemId - The ID of the problem being solved
 * @returns {JSX.Element} A Material-UI Chip component showing session status
 */
import React from "react";
import { Chip } from "@mui/material";
import { Play } from "lucide-react";

const SessionStatusTag = ({ sessionId, problemId }) => {
  return (
    <Chip
      icon={<Play size={16} />}
      label="Session Ongoing"
      size="small"
      sx={{
        bgcolor: "rgba(74, 222, 128, 0.1)",
        color: "#4ade80",
        borderColor: "#4ade80",
        border: "1px solid",
        "&:hover": {
          bgcolor: "rgba(74, 222, 128, 0.2)",
        },
        cursor: "pointer",
        ml: 2,
      }}
    />
  );
};

export default SessionStatusTag;
