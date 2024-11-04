import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
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
  Autocomplete,
  Chip,
} from "@mui/material";
import { Plus, Trash2, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../context/authContext";
import ProblemService from "../Services/problemService";
import http from "../http-common";
import { getTokenBearer } from "../utils/token";
import ProblemImage from "../components/problem-common/ProblemImage";


// Predefined tags
const AVAILABLE_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Database",
  "Binary Search",
  "Matrix",
  "Tree",
  "Breadth-First Search",
  "Bit Manipulation",
  "Two Pointers",
  "Heap (Priority Queue)",
  "Binary Tree",
  "Prefix Sum",
  "Simulation",
  "Stack",
  "Counting",
  "Graph",
  "Sliding Window",
  "Design",
  "Backtracking",
  "Enumeration",
  "Union Find",
  "Linked List",
  "Ordered Set",
  "Number Theory",
  "Monotonic Stack",
  "Trie",
  "Segment Tree",
  "Bitmask",
  "Divide and Conquer",
  "Queue",
  "Recursion",
  "Combinatorics",
  "Binary Search Tree",
  "Hash Function",
  "Binary Indexed Tree",
  "Geometry",
  "Memoization",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Shortest Path",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Randomized",
  "Merge Sort",
  "Doubly-Linked List",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Bucket Sort",
  "Minimum Spanning Tree",
  "Shell",
  "Line Sweep",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
].sort();

const AddProblemPage = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { problemId } = useParams();
  console.log("Mode:", mode, "ProblemId:", problemId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    test_cases: [{ input: "", expected_output: "" }],
    tags: [], // Added tags to formData
  });

  const [testCaseImages, setTestCaseImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("ohh so cool no name huh");
      return false;
    }
    if (!formData.description.trim()) {
      setError(
        "How the hell are we supposed to know what this is about ,PUT THE DESCRIPTION BACK"
      );
      return false;
    }
    if (formData.tags.length === 0) {
      setError("so no tags yea, bold choice");
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

 useEffect(() => {
   const loadProblem = async () => {
     if (mode === "edit" && problemId) {
       try {
         const response = await ProblemService.getProblemById(problemId);
         const problem = response.data;

         // Verify user is creator
         if (user?.user_id !== problem.created_by) {
           navigate("/problems");
           return;
         }

         // Set form data from existing problem
         setFormData({
           title: problem.title,
           description: problem.description,
           difficulty: problem.difficulty,
           test_cases: problem.test_cases || [
             { input: "", expected_output: "" },
           ],
           tags: problem.metadata?.tags || [],
         });

         // Set images if they exist
         if (problem.metadata?.example_images) {
           setTestCaseImages(problem.metadata.example_images);
         }
       } catch (err) {
         setError("Failed to load problem");
         navigate("/problems");
       }
     }
     setInitialLoadComplete(true);
   };

   loadProblem();
 }, [problemId, mode, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user makes changes
  };

  const handleTagsChange = (_, newTags) => {
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
    setError("");
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
     const formData = new FormData();
     formData.append("image", file);

     const response = await http.post("/upload", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
         Authorization: getTokenBearer(),
       },
     });

     // Log the response to see what we're getting
     console.log("Upload response:", response.data);

     const imagePath = response.data.path;
     console.log("Image path being saved:", imagePath);

     const newImages = [...testCaseImages];
     newImages[index] = imagePath;
     setTestCaseImages(newImages);

     // Log the updated testCaseImages
     console.log("Updated testCaseImages:", newImages);
   } catch (err) {
     console.error("Upload error:", err);
     setError("Error uploading image");
   }
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
        test_cases: formData.test_cases.map((tc) => ({
          input: tc.input.trim(),
          expected_output: tc.expected_output.trim(),
        })),
        example_images: testCaseImages,
        tags: formData.tags,
      };

      if (mode === "edit") {
        await ProblemService.updateProblem(problemId, problemData);
      } else {
        await ProblemService.addProblem({
          ...problemData,
          created_by: user.user_id,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/problems");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${
            mode === "edit" ? "update" : "create"
          } problem. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitle = mode === "edit" ? "Edit Problem" : "Create New Problem";

  // Don't render until initial load is complete
  if (!initialLoadComplete) {
    return null;
  }



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
            {pageTitle}
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

              <Autocomplete
                multiple
                options={AVAILABLE_TAGS}
                value={formData.tags}
                onChange={handleTagsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#FAF0CA",
                        "& fieldset": { borderColor: "#5A189A" },
                      },
                      "& .MuiInputLabel-root": { color: "#FAF0CA" },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor: "rgba(157, 78, 221, 0.3)",
                        color: "#FAF0CA",
                        "& .MuiChip-deleteIcon": {
                          color: "#FAF0CA",
                          "&:hover": {
                            color: "#ff4444",
                          },
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  "& .MuiAutocomplete-tag": {
                    backgroundColor: "rgba(157, 78, 221, 0.3)",
                    color: "#FAF0CA",
                  },
                }}
              />

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
                            <ProblemImage imagePath={testCaseImages[index]} />
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
