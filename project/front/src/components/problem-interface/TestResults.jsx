import React from "react";
import { Box, Stack, Typography, Alert, Tab, Tabs, Paper } from "@mui/material";
import { useEditor } from "../../context/editorContext";
import { Terminal, CheckCircle2, XCircle } from "lucide-react";

const TestResults = ({ problem }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { testResults } = useEditor();

  return (
    <Stack sx={{ height: "100%" }}>
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: "rgba(157, 78, 221, 0.2)",
          minHeight: 42,
          "& .MuiTab-root": {
            minHeight: 42,
            color: "#9D4EDD",
            fontSize: "0.875rem",
            textTransform: "none",
            "&.Mui-selected": {
              color: "#FAF0CA",
            },
          },
        }}
      >
        <Tab
          icon={<Terminal size={16} />}
          iconPosition="start"
          label="Test Cases"
        />
        <Tab
          icon={<CheckCircle2 size={16} />}
          iconPosition="start"
          label="Results"
        />
      </Tabs>

      <Box sx={{ flex: 1, overflow: "auto", pt: 2 }}>
        {selectedTab === 0 ? (
          <Stack spacing={2}>
            {problem.test_cases.map((testCase, index) => (
              <Paper
                key={index}
                sx={{
                  bgcolor: "rgba(60, 9, 108, 0.3)",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography
                  sx={{ color: "#9D4EDD", mb: 1, fontSize: "0.875rem" }}
                >
                  Test Case {index + 1}
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ bgcolor: "#1A1626", p: 1.5, borderRadius: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FAF0CA",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                      }}
                    >
                      Input: {testCase.input}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#1A1626", p: 1.5, borderRadius: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FAF0CA",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                      }}
                    >
                      Expected: {testCase.expected_output}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box>
            {testResults ? (
              <Stack spacing={2}>
                {testResults.results.map((result, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      bgcolor: result.passed
                        ? "rgba(74, 222, 128, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: result.passed
                        ? "rgba(74, 222, 128, 0.3)"
                        : "rgba(248, 113, 113, 0.3)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {result.passed ? (
                        <CheckCircle2 size={16} color="#4ade80" />
                      ) : (
                        <XCircle size={16} color="#f87171" />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: result.passed ? "#4ade80" : "#f87171",
                          fontSize: "0.875rem",
                        }}
                      >
                        Test Case {index + 1}:{" "}
                        {result.passed ? "Passed" : "Failed"}
                      </Typography>
                    </Stack>
                    {!result.passed && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.5,
                          bgcolor: "#1A1626",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            color: "#FAF0CA",
                            fontSize: "0.8rem",
                          }}
                        >
                          Your Output: {result.output}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography
                sx={{
                  color: "#9D4EDD",
                  textAlign: "center",
                  mt: 4,
                  fontSize: "0.875rem",
                }}
              >
                Run your code to see test results
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default TestResults;
