import React from "react";
import { Box, Stack, Button, IconButton } from "@mui/material";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import ProblemImage from "../problem-common/ProblemImage";

const TestCaseImageUpload = ({ index, image, onUpload, onRemove }) => (
  <Box sx={{ mt: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Button
        component="label"
        variant="outlined"
        startIcon={image ? <ImageIcon /> : <Upload />}
        sx={{
          color: "#FAF0CA",
          borderColor: "#5A189A",
          "&:hover": {
            borderColor: "#7B2CBF",
            bgcolor: "#240046",
          },
        }}
      >
        {image ? "Change Image" : "Add Example Image (Optional)"}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => onUpload(index, e.target.files[0])}
        />
      </Button>
      {image && (
        <IconButton onClick={() => onRemove(index)} sx={{ color: "#ff4444" }}>
          <Trash2 size={16} />
        </IconButton>
      )}
    </Stack>
    {image && <ProblemImage imagePath={image} />}
  </Box>
);

export default TestCaseImageUpload;
