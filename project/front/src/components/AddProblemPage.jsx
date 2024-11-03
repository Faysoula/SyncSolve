import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  IconButton,
  Stack,
  Alert,
  Fade,
} from "@mui/material";
import { Plus, Trash2, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../context/authContext";
import ProblemService from "../Services/problemService";

const AddProblemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    test_cases: [{ input: "", expected_output: "" }],
  });

  const [testCaseImages, setTestCaseImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }

    // Validate test cases
    for (let i = 0; i < formData.test_cases.length; i++) {
      const testCase = formData.test_cases[i];
      if (!testCase.input.trim() || !testCase.expected_output.trim()) {
        setError(`Test case #${i + 1} is incomplete`);
        return false;
      }
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user makes changes
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.test_cases];
    newTestCases[index] = {
      ...newTestCases[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      test_cases: newTestCases,
    }));
    setError(""); // Clear error when user makes changes
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      const newImages = [...testCaseImages];
      newImages[index] = base64;
      setTestCaseImages(newImages);
    } catch (err) {
      setError("Error processing image");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      test_cases: [...prev.test_cases, { input: "", expected_output: "" }],
    }));
  };

  const removeTestCase = (index) => {
    if (formData.test_cases.length === 1) {
      setError("At least one test case is required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, i) => i !== index),
    }));

    setTestCaseImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeImage = (index) => {
    setTestCaseImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a problem");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const problemData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        created_by: user.user_id,
        test_cases: formData.test_cases.map((tc) => ({
          input: tc.input.trim(),
          expected_output: tc.expected_output.trim(),
        })),
      };

      await ProblemService.addProblem(problemData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/problems");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create problem. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0118", pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        {success && (
          <Fade in={success}>
            <Alert severity="success" sx={{ mb: 4 }}>
              Problem created successfully! Redirecting...
            </Alert>
          </Fade>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ bgcolor: "#3C096C", p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "#FAF0CA", mb: 4 }}
          >
            Create New Problem
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <TextField
                label="Problem Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#FAF0CA",
                    "& fieldset": { borderColor: "#5A189A" },
                  },
                  "& .MuiInputLabel-root": { color: "#FAF0CA" },
                }}
              />

              <TextField
                label="Problem Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={6}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#FAF0CA",
                    "& fieldset": { borderColor: "#5A189A" },
                  },
                  "& .MuiInputLabel-root": { color: "#FAF0CA" },
                }}
              />

              <TextField
                select
                label="Difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                sx={{
                  width: 200,
                  "& .MuiOutlinedInput-root": {
                    color: "#FAF0CA",
                    "& fieldset": { borderColor: "#5A189A" },
                  },
                  "& .MuiInputLabel-root": { color: "#FAF0CA" },
                }}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </TextField>

              <Box>
                <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 2 }}>
                  Test Cases
                </Typography>
                <Stack spacing={3}>
                  {formData.test_cases.map((testCase, index) => (
                    <Card key={index} sx={{ bgcolor: "#240046", p: 3 }}>
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
                            onClick={() => removeTestCase(index)}
                            sx={{ color: "#ff4444" }}
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Stack>

                        <TextField
                          label="Input"
                          value={testCase.input}
                          onChange={(e) =>
                            handleTestCaseChange(index, "input", e.target.value)
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

                        <TextField
                          label="Expected Output"
                          value={testCase.expected_output}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "expected_output",
                              e.target.value
                            )
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

                        <Box sx={{ mt: 2 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={
                                testCaseImages[index] ? (
                                  <ImageIcon />
                                ) : (
                                  <Upload />
                                )
                              }
                              sx={{
                                color: "#FAF0CA",
                                borderColor: "#5A189A",
                                "&:hover": {
                                  borderColor: "#7B2CBF",
                                  bgcolor: "#240046",
                                },
                              }}
                            >
                              {testCaseImages[index]
                                ? "Change Image"
                                : "Add Example Image (Optional)"}
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageUpload(index, e.target.files[0])
                                }
                              />
                            </Button>
                            {testCaseImages[index] && (
                              <IconButton
                                onClick={() => removeImage(index)}
                                sx={{ color: "#ff4444" }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            )}
                          </Stack>
                          {testCaseImages[index] && (
                            <Box sx={{ mt: 2, maxWidth: "200px" }}>
                              <img
                                src={testCaseImages[index]}
                                alt={`Example for test case ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: "4px",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Stack>
                    </Card>
                  ))}

                  <Button
                    startIcon={<Plus />}
                    onClick={addTestCase}
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

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/problems")}
                  sx={{
                    color: "#FAF0CA",
                    borderColor: "#5A189A",
                    "&:hover": { borderColor: "#7B2CBF", bgcolor: "#240046" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? null : <Save />}
                  sx={{
                    bgcolor: "#7B2CBF",
                    "&:hover": { bgcolor: "#9D4EDD" },
                    "&:disabled": { bgcolor: "#5A189A" },
                  }}
                >
                  {isLoading ? "Creating..." : "Create Problem"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default AddProblemPage;
