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
