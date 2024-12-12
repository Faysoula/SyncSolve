/**
 * ProblemForm component renders a form for creating or editing a problem.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.mode="create"] - The mode of the form, either "create" or "edit".
 * @param {Object} props.formData - The form data for the problem.
 * @param {Array} props.testCaseImages - The images associated with test cases.
 * @param {boolean} props.success - Indicates if the form submission was successful.
 * @param {string} props.error - The error message if the form submission failed.
 * @param {boolean} props.isLoading - Indicates if the form is in a loading state.
 * @param {Function} props.onFormSubmit - The function to call when the form is submitted.
 * @param {Function} props.onCancel - The function to call when the form is cancelled.
 * @param {Function} props.onFormChange - The function to call when the form data changes.
 * @param {Function} props.onTestCaseChange - The function to call when a test case changes.
 * @param {Function} props.onImageUpload - The function to call when an image is uploaded.
 * @param {Function} props.onImageRemove - The function to call when an image is removed.
 * @param {Function} props.onTagsChange - The function to call when tags change.
 * @param {Function} props.onAddTestCase - The function to call when a new test case is added.
 *
 * @returns {JSX.Element} The rendered ProblemForm component.
 */
import React from "react";
import { Box, Container, Card, Stack, Alert, Fade } from "@mui/material";
import FormHeader from "./FormHeader";
import BasicDetailsSection from "./BasicDetailsSection";
import TestCasesSection from "./TestCasesSection";
import FormActions from "./FormActions";

const ProblemForm = ({
  mode = "create",
  formData,
  testCaseImages,
  success,
  error,
  isLoading,
  onFormSubmit,
  onCancel,
  onFormChange,
  onTestCaseChange,
  onImageUpload,
  onImageRemove,
  onTagsChange,
  onAddTestCase,
}) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0118", pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        {success && (
          <Fade in={success}>
            <Alert severity="success" sx={{ mb: 4 }}>
              Problem {mode === "edit" ? "updated" : "created"} successfully!
              Redirecting...
            </Alert>
          </Fade>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ bgcolor: "#3C096C", p: 4, borderRadius: 2 }}>
          <FormHeader mode={mode} />

          <form onSubmit={onFormSubmit}>
            <Stack spacing={4}>
              <BasicDetailsSection
                formData={formData}
                onChange={onFormChange}
                onTagsChange={onTagsChange}
              />

              <TestCasesSection
                testCases={formData.test_cases}
                testCaseImages={testCaseImages}
                onTestCaseChange={onTestCaseChange}
                onImageUpload={onImageUpload}
                onImageRemove={onImageRemove}
                onAddTestCase={onAddTestCase}
              />

              <FormActions
                mode={mode}
                isLoading={isLoading}
                onCancel={onCancel}
              />
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default ProblemForm;
