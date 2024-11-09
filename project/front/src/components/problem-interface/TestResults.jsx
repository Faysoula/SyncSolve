import React from "react";
import {
  Box,
  Stack,
  Typography,
  Alert,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { useEditor } from "../../context/editorContext";
import {
  Terminal,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const TestResults = ({ problem }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { testResults } = useEditor();
  const [expandedTest, setExpandedTest] = React.useState(null);

  return (
    <Stack
      sx={{
        height: "100%",
        flex: 1,
        minHeight: 0, // This is important for proper flex behavior
      }}
    >
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
          icon={
            testResults?.allPassed ? (
              <CheckCircle2 size={16} color="#4ade80" />
            ) : testResults?.error ? (
              <XCircle size={16} color="#f87171" />
            ) : (
              <Terminal size={16} />
            )
          }
          iconPosition="start"
          label="Results"
        />
      </Tabs>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          pt: 2,
          px: 2,
          // Add custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#1A1626",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3C096C",
            borderRadius: "3px",
          },
          
        }}
      >
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
                      variant="caption"
                      sx={{ color: "#9D4EDD", display: "block", mb: 1 }}
                    >
                      Input:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FAF0CA",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {testCase.input}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#1A1626", p: 1.5, borderRadius: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#9D4EDD", display: "block", mb: 1 }}
                    >
                      Expected:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FAF0CA",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {testCase.expected_output}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Stack spacing={2}>
            {testResults?.isLoading ? (
              <Stack alignItems="center" spacing={2} py={4}>
                <CircularProgress sx={{ color: "#9D4EDD" }} />
                <Typography sx={{ color: "#9D4EDD" }}>
                  Running tests...
                </Typography>
              </Stack>
            ) : testResults?.error ? (
              <Alert
                severity="error"
                sx={{
                  bgcolor: "rgba(248, 113, 113, 0.1)",
                  color: "#f87171",
                }}
              >
                {testResults.error}
              </Alert>
            ) : testResults?.results ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    py: 2,
                  }}
                >
                  {testResults.allPassed ? (
                    <CheckCircle2 size={24} color="#4ade80" />
                  ) : (
                    <XCircle size={24} color="#f87171" />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      color: testResults.allPassed ? "#4ade80" : "#f87171",
                    }}
                  >
                    {testResults.allPassed
                      ? "All Tests Passed!"
                      : "Some Tests Failed"}
                  </Typography>
                </Box>

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
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setExpandedTest(expandedTest === index ? null : index)
                    }
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
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
                        {expandedTest === index ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </Stack>

                      <Collapse in={expandedTest === index}>
                        <Stack spacing={2}>
                          <Box
                            sx={{ bgcolor: "#1A1626", p: 2, borderRadius: 1 }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#9D4EDD", display: "block", mb: 1 }}
                            >
                              Input:
                            </Typography>
                            <Typography
                              sx={{
                                color: "#FAF0CA",
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {problem.test_cases[index].input}
                            </Typography>
                          </Box>

                          <Box
                            sx={{ bgcolor: "#1A1626", p: 2, borderRadius: 1 }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#9D4EDD", display: "block", mb: 1 }}
                            >
                              Expected Output:
                            </Typography>
                            <Typography
                              sx={{
                                color: "#FAF0CA",
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {problem.test_cases[index].expected_output}
                            </Typography>
                          </Box>

                          {!result.passed && (
                            <Box
                              sx={{ bgcolor: "#1A1626", p: 2, borderRadius: 1 }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#f87171",
                                  display: "block",
                                  mb: 1,
                                }}
                              >
                                Your Output:
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#FAF0CA",
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {result.output}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Collapse>
                    </Stack>
                  </Paper>
                ))}
              </>
            ) : (
              <Stack alignItems="center" spacing={2} py={4}>
                <Terminal size={24} color="#9D4EDD" />
                <Typography sx={{ color: "#9D4EDD" }}>
                  Run your code to see test results
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default TestResults;
