import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import ProblemService from "../../Services/problemService";
import http from "../../http-common";
import { getTokenBearer } from "../../utils/token";
import ProblemForm from "./ProblemForm";

const AddProblemContainer = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { problemId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    test_cases: [{ input: "", expected_output: "" }],
    tags: [],
  });

  const [testCaseImages, setTestCaseImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const loadProblem = async () => {
      if (mode === "edit" && problemId) {
        try {
          const response = await ProblemService.getProblemById(problemId);
          const problem = response.data;

          if (user?.user_id !== problem.created_by) {
            navigate("/problems");
            return;
          }

          setFormData({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            test_cases: problem.test_cases || [
              { input: "", expected_output: "" },
            ],
            tags: problem.metadata?.tags || [],
          });

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

    for (let i = 0; i < formData.test_cases.length; i++) {
      const testCase = formData.test_cases[i];
      if (!testCase.input.trim() || !testCase.expected_output.trim()) {
        setError(`Test case #${i + 1} is incomplete`);
        return false;
      }
    }

    return true;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
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
    if (typeof value === "string") {
      newTestCases[index] = {
        ...newTestCases[index],
        [field]: value,
      };
    } else {
      newTestCases.splice(index, 1);
    }
    setFormData((prev) => ({
      ...prev,
      test_cases: newTestCases,
    }));
    setError("");
  };
  const handleAddTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      test_cases: [...prev.test_cases, { input: "", expected_output: "" }],
    }));
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

      const imagePath = response.data.path;
      const newImages = [...testCaseImages];
      newImages[index] = imagePath;
      setTestCaseImages(newImages);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading image");
    }
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

  const handleImageRemove = (index) => {
    setTestCaseImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  if (!initialLoadComplete) {
    return null;
  }

  return (
    <ProblemForm
      mode={mode}
      formData={formData}
      testCaseImages={testCaseImages}
      success={success}
      error={error}
      isLoading={isLoading}
      onFormSubmit={handleSubmit}
      onCancel={() => navigate("/problems")}
      onFormChange={handleFormChange}
      onTagsChange={handleTagsChange}
      onTestCaseChange={handleTestCaseChange}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
      onAddTestCase={handleAddTestCase}
    />
  );
};

export default AddProblemContainer;