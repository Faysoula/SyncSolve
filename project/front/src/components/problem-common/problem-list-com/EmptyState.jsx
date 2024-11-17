import React from "react";
import { Card, Typography } from "@mui/material";
import { problemListStyles } from "../../../utils/styles";

export const EmptyState = () => (
  <Card sx={problemListStyles.emptyState}>
    <Typography variant="h6" sx={{ color: "#FAF0CA", mb: 1 }}>
      No problems found
    </Typography>
    <Typography variant="body2" sx={{ color: "#FAF0CA", opacity: 0.8 }}>
      Try adjusting your search or filter criteria
    </Typography>
  </Card>
);
