import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { MessageSquare } from "lucide-react";
import ChatWindow from "./chatWindow";

export const ChatButton = ({ teamId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          bgcolor: "#7B2CBF",
          color: "#FAF0CA",
          "&:hover": {
            bgcolor: "#9D4EDD",
          },
          width: 48,
          height: 48,
        }}
      >
        <MessageSquare size={24} />
      </IconButton>

      {isOpen && (
        <ChatWindow teamId={teamId} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default ChatButton;
