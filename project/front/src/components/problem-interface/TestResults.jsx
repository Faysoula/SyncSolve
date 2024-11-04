import React from "react";
import { Box, Stack, Typography, Alert, Card, Tab, Tabs } from "@mui/material";
import { useEditor } from "../../context/editorContext";

const TestResults = ({ problem }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { testResults } = useEditor();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: "#5A189A",
          "& .MuiTab-root": {
            color: "#FAF0CA",
            "&.Mui-selected": {
              color: "#9D4EDD",
            },
          },
        }}
      >
        <Tab label="Test Cases" />
        <Tab label="Results" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {selectedTab === 0 ? (
          <Stack spacing={2}>
            {problem.test_cases.map((testCase, index) => (
              <Card key={index} sx={{ bgcolor: "#240046", p: 3 }}>
                <Typography sx={{ color: "#FAF0CA", mb: 2 }}>
                  Test Case {index + 1}
                </Typography>
                <Box sx={{ bgcolor: "#3C096C", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FAF0CA", fontFamily: "monospace" }}
                  >
                    Input: {testCase.input}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "#3C096C", p: 2, borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FAF0CA", fontFamily: "monospace" }}
                  >
                    Expected: {testCase.expected_output}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box>
            {testResults ? (
              <Stack spacing={2}>
                {testResults.results.map((result, index) => (
                  <Alert
                    key={index}
                    severity={result.passed ? "success" : "error"}
                    sx={{
                      bgcolor: result.passed
                        ? "rgba(74, 222, 128, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",
                      color: result.passed ? "#4ade80" : "#f87171",
                    }}
                  >
                    <Typography variant="body2">
                      Test Case {index + 1}:{" "}
                      {result.passed ? "Passed" : "Failed"}
                    </Typography>
                    {!result.passed && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontFamily: "monospace" }}
                      >
                        Your Output: {result.output}
                      </Typography>
                    )}
                  </Alert>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "#FAF0CA", textAlign: "center" }}>
                Run your code to see test results
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TestResults;
