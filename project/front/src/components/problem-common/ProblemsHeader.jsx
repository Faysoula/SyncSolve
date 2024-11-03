import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProblemsHeader = ({ problemCount }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 6 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <BookOpen size={32} className="text-purple-400" />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#FAF0CA" }}>
            Problem Bank
          </Typography>
        </Stack>

        <Stack alignItems="flex-end" spacing={1}>
          <Typography
            variant="body2"
            sx={{
              color: "#FAF0CA",
              opacity: 0.8,
              fontStyle: "italic",
            }}
          >
            Have a challenging problem in mind?
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/problems/add")}
            sx={{
              bgcolor: "#7B2CBF",
              color: "#FAF0CA",
              "&:hover": {
                bgcolor: "#9D4EDD",
              },
              px: 3,
              py: 1,
            }}
          >
            Add Problem
          </Button>
        </Stack>
      </Stack>

      <Typography
        variant="body1"
        sx={{ color: "#FAF0CA", maxWidth: "600px", opacity: 0.7 }}
      >
        Sharpen your coding skills with our carefully curated collection of
        programming challenges.
        {problemCount > 0 &&
          ` Showing ${problemCount} problem${problemCount !== 1 ? "s" : ""}.`}
      </Typography>
    </Box>
  );
};

export default ProblemsHeader;
