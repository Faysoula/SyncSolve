import React from "react";
import {
  Box,
  Stack,
  Card,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { styles } from "../../utils/styles";
import TestCaseInput from "./TestCaseInput";

const TestCase = ({
  index,
  testCase,
  image,
  onTestCaseChange,
  onImageUpload,
  onImageRemove,
}) => {
  return (
    <Card sx={styles.testCaseCard}>
      <Stack spacing={2}>
        {/* Test Case Header */}
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

        {/* Input Field */}
        <TestCaseInput
          label="Input"
          value={testCase.input}
          onChange={(e) => onTestCaseChange(index, "input", e.target.value)}
          multiline
          rows={2}
        />

        {/* Expected Output Field */}
        <TestCaseInput
          label="Expected Output"
          value={testCase.expected_output}
          onChange={(e) =>
            onTestCaseChange(index, "expected_output", e.target.value)
          }
          multiline
          rows={2}
        />

        {/* Image Upload Section */}
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
                onChange={(e) => onImageUpload(index, e.target.files[0])}
              />
            </Button>
            {image && (
              <IconButton
                onClick={() => onImageRemove(index)}
                sx={{ color: "#ff4444" }}
              >
                <Trash2 size={16} />
              </IconButton>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default TestCase;
