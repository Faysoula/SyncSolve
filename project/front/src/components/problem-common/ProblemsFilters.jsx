import React from "react";
import {
  Card,
  Box,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";

const styles = {
  filterCard: {
    mb: 4,
    bgcolor: "#3C096C",
    borderRadius: 2,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#240046",
      "& input": { color: "#FAF0CA" },
      "& fieldset": { borderColor: "#5A189A" },
      "&:hover fieldset": { borderColor: "#7B2CBF" },
      "&.Mui-focused fieldset": { borderColor: "#9D4EDD" },
    },
  },
  select: {
    bgcolor: "#240046",
    color: "#FAF0CA",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5A189A" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7B2CBF" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9D4EDD",
    },
    "& .MuiSvgIcon-root": { color: "#FAF0CA" },
  },
};

export const ProblemsFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card sx={styles.filterCard}>
      <Box
        sx={{
          p: 3,
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: { xs: "1", md: "5" } }}>
          <TextField
            fullWidth
            placeholder="Search problems..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#FAF0CA" }} />
                </InputAdornment>
              ),
            }}
            sx={styles.searchField}
          />
        </Box>
        <Box sx={{ flex: { xs: "1", md: "3" } }}>
          <Select
            fullWidth
            value={filters.difficultyFilter}
            onChange={(e) =>
              handleFilterChange("difficultyFilter", e.target.value)
            }
            sx={styles.select}
          >
            <MenuItem value="all">All Difficulties</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </Box>
        <Box sx={{ flex: { xs: "1", md: "3" } }}>
          <Select
            fullWidth
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            sx={styles.select}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="difficulty">Difficulty</MenuItem>
          </Select>
        </Box>
      </Box>
    </Card>
  );
};

// Need to export as default as well
export default ProblemsFilters;
