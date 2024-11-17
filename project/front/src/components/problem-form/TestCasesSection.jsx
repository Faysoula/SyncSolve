import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { Plus } from "lucide-react";
import { styles } from "../../utils/styles";
import TestCase from "./TestCases";

const TestCasesSection = ({
  testCases,
  testCaseImages,
  onTestCaseChange,
  onImageUpload,
  onImageRemove,
  onAddTestCase,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 2 }}>
        Test Cases
      </Typography>
      <Stack spacing={3}>
        {testCases.map((testCase, index) => (
          <TestCase
            key={index}
            index={index}
            testCase={testCase}
            image={testCaseImages[index]}
            onTestCaseChange={onTestCaseChange}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        ))}
        <Button
          startIcon={<Plus />}
          onClick={onAddTestCase}
          variant="outlined"
          sx={{
            color: "#FAF0CA",
            borderColor: "#5A189A",
            "&:hover": { borderColor: "#7B2CBF", bgcolor: "#240046" },
          }}
        >
          Add Test Case
        </Button>
      </Stack>
    </Box>
  );
};

export default TestCasesSection;
