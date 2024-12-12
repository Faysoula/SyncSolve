
/**
 * @component ProblemsPage
 * @description A component that displays a list of problems with filtering capabilities.
 * Requires authentication to access. Shows loading state while fetching data.
 * 
 * @requires React
 * @requires @mui/material
 * @requires ../context/authContext
 * @requires ../hooks/useProblemData
 * 
 * @returns {JSX.Element} Returns either:
 *  - AuthRequiredCard if user is not authenticated
 *  - LoadingState while data is being fetched
 *  - The main problems page layout with filters and list of problems
 * 
 * @example
 * <ProblemsPage />
 */
import React from "react";
import { Box, Container, Alert } from "@mui/material";

import { useAuth } from "../context/authContext";
import useProblemsData from "../hooks/useProblemData";
import ProblemsHeader from "../components/problem-common/ProblemsHeader";
import FilterSection from "../components/FilterSelect.jsx";
import ProblemsList from "../components/problem-common/problem-list-com/ProblemsList";
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
