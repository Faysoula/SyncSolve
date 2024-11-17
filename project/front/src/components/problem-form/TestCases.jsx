import React from "react";
import {
  Box,
  Stack,
  Card,
  TextField,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";

const TestCase = ({
  index,
  testCase,
  image,
  onTestCaseChange,
  onImageUpload,
  onImageRemove,
}) => {
  const imageUrl = image ? `http://localhost:3001/uploads/${image}` : null;

  return (
    <Card
      sx={{
        bgcolor: "#240046",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ color: "#FAF0CA" }}>
            Test Case #{index + 1}
          </Typography>
          <IconButton
            onClick={() => onTestCaseChange(index)}
            sx={{ color: "#ff4444" }}
          >
            <Trash2 size={20} />
          </IconButton>
        </Stack>

        <TextField
          label="Input"
          value={testCase.input}
          onChange={(e) => onTestCaseChange(index, "input", e.target.value)}
          multiline
          rows={2}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#FAF0CA",
              "& fieldset": { borderColor: "#5A189A" },
            },
            "& .MuiInputLabel-root": { color: "#FAF0CA" },
          }}
        />

        <TextField
          label="Expected Output"
          value={testCase.expected_output}
          onChange={(e) =>
            onTestCaseChange(index, "expected_output", e.target.value)
          }
          multiline
          rows={2}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#FAF0CA",
              "& fieldset": { borderColor: "#5A189A" },
            },
            "& .MuiInputLabel-root": { color: "#FAF0CA" },
          }}
        />

        {imageUrl ? (
          <Box sx={{ position: "relative" }}>
            <img
              src={imageUrl}
              alt="Test case example"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
            <IconButton
              onClick={() => onImageRemove(index)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "#ff4444",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Box>
        ) : (
          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<Upload />}
            sx={{
              color: "#FAF0CA",
              borderColor: "#5A189A",
              p: 2,
              "&:hover": {
                borderColor: "#7B2CBF",
                bgcolor: "#240046",
              },
            }}
          >
            Add Example Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => onImageUpload(index, e.target.files[0])}
            />
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default TestCase;
