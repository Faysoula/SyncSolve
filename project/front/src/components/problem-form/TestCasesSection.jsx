import React from "react";
import { Box, Typography, Stack, Card } from "@mui/material";
import { styles } from "../../utils/styles";
import TestCaseInput from "./TestCaseInput";
import TestCaseHeader from "./TestCaseHeader";
import TestCaseImageUpload from "./TestCaseImageUpload";
import AddTestCaseButton from "./AddTestCaseButton";

const TestCasesSection = ({
  testCases,
  testCaseImages,
  onTestCaseChange,
  onImageUpload,
  onImageRemove,
}) => (
  <Card sx={styles.testCaseCard}>
    <Box>
      <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 2 }}>
        Test Cases
      </Typography>
      <Stack spacing={3}>
        {testCases.map((testCase, index) => (
          <Card key={index} sx={styles.testCaseCard}>
            <Stack spacing={2}>
              <TestCaseHeader
                index={index}
                onRemove={() => onTestCaseChange(index)}
              />
              <TestCaseInput
                label="Input"
                value={testCase.input}
                onChange={(e) =>
                  onTestCaseChange(index, "input", e.target.value)
                }
              />
              <TestCaseInput
                label="Expected Output"
                value={testCase.expected_output}
                onChange={(e) =>
                  onTestCaseChange(index, "expected_output", e.target.value)
                }
              />
              <TestCaseImageUpload
                index={index}
                image={testCaseImages[index]}
                onUpload={onImageUpload}
                onRemove={onImageRemove}
              />
            </Stack>
          </Card>
        ))}
        <AddTestCaseButton onClick={onTestCaseChange} />
      </Stack>
    </Box>
  </Card>
);

export default TestCasesSection;
