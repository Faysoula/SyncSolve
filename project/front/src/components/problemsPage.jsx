import React from "react";
import { Box, Container, Alert } from "@mui/material";

import { useAuth } from "../context/authContext";
import useProblemsData from "../hooks/useProblemData";
import ProblemsHeader from "../components/problem-common/ProblemsHeader";
import FilterSection from "../components/FilterSelect.jsx"; // New import
import ProblemsList from "../components/problem-common/ProblemsList";
import AuthRequiredCard from "./common/AuthRequiredCard.jsx";
import LoadingState from "./common/LoadingState.jsx";

const ProblemsPage = () => {
  const { user } = useAuth();
  const {
    problems,
    loading,
    error,
    filteredProblems,
    userMap,
    filters,
    setFilters,
  } = useProblemsData();

  if (!user) {
    return <AuthRequiredCard />;
  }

  if (loading) {
    return <LoadingState message="Loading problems..." />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0118", pt: 8, pb: 6 }}>
      <Container maxWidth="xl">
        <ProblemsHeader problemCount={filteredProblems.length} />

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Replace ProblemsFilters with FilterSection */}
        <FilterSection filters={filters} onFilterChange={setFilters} />

        <ProblemsList problems={filteredProblems} userMap={userMap} />
      </Container>
    </Box>
  );
};

export default ProblemsPage;
