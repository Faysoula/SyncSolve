// components/problem-common/ProblemImage.jsx
import React, { useState } from "react";
import { Box, Modal, IconButton } from "@mui/material";
import { Maximize2, X } from "lucide-react";

const ProblemImage = ({ imagePath }) => {
  const [open, setOpen] = useState(false);

  if (!imagePath) return null;

  const imageUrl = `http://localhost:3001/uploads/${imagePath}`;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          mt: 2,
          "&:hover .zoom-button": {
            opacity: 1,
          },
        }}
      >
        <img
          src={imageUrl}
          alt="Test case example"
          style={{
            width: "300px", // Increased base size
            height: "auto",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
          onError={(e) => {
            console.error("Image load error for URL:", imageUrl);
            e.target.style.display = "none";
          }}
        />
        <IconButton
          className="zoom-button"
          onClick={() => setOpen(true)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            backgroundColor: "rgba(60, 9, 108, 0.8)",
            color: "#FAF0CA",
            opacity: 0,
            transition: "opacity 0.2s",
            "&:hover": {
              backgroundColor: "rgba(90, 24, 154, 0.9)",
            },
          }}
        >
          <Maximize2 size={20} />
        </IconButton>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: -20,
              top: -20,
              backgroundColor: "rgba(60, 9, 108, 0.8)",
              color: "#FAF0CA",
              "&:hover": {
                backgroundColor: "rgba(90, 24, 154, 0.9)",
              },
            }}
          >
            <X size={24} />
          </IconButton>
          <img
            src={imageUrl}
            alt="Test case example (enlarged)"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            onError={(e) => {
              console.error("Image load error for URL:", imageUrl);
              e.target.style.display = "none";
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ProblemImage;
