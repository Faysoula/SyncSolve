import React from "react";
import { Stack, Chip, Typography, Box } from "@mui/material";

export const ProblemTags = ({ tags }) => (
  <Box>
    {tags && tags.length > 0 ? (
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            sx={{
              bgcolor: "rgba(157, 78, 221, 0.1)",
              color: "#9D4EDD",
              borderColor: "#9D4EDD",
              "&:hover": {
                bgcolor: "rgba(157, 78, 221, 0.2)",
              },
            }}
          />
        ))}
      </Stack>
    ) : (
      <Typography
        variant="body2"
        sx={{
          color: "#9D4EDD",
          fontStyle: "italic",
          opacity: 0.8,
        }}
      >
        no tags here you're on your own :/
      </Typography>
    )}
  </Box>
);
