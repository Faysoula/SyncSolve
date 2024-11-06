import React, { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeamInviteModal from "../TeamInviteModal";
import TeamDropdown from "../TeamDropdown";

export const ProblemsHeader = ({ problemCount }) => {
  const navigate = useNavigate();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  return (
    <>
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

          <Stack direction="row" spacing={2}>
            <TeamDropdown onCreateTeam={() => setIsTeamModalOpen(true)} />

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

      <TeamInviteModal
        open={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </>
  );
};

export default ProblemsHeader;
