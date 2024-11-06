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
          <BookOpen size={32} className="text-purple-700" />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#FAF0CA" }}>
            Problem Bank
          </Typography>
        </Stack>

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
