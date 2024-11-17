import React from "react";
import { Stack } from "@mui/material";
import { ProblemCard } from "../../cards/ProblemCard";
import { EmptyState } from "./EmptyState";

const ProblemsList = ({ problems, userMap }) => (
  <Stack spacing={2}>
    {problems.length > 0 ? (
      problems.map((problem) => (
        <ProblemCard
          key={problem.problem_id}
          problem={problem}
          username={userMap[problem.created_by]?.username}
        />
      ))
    ) : (
      <EmptyState />
    )}
  </Stack>
);

export default ProblemsList;
