import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { Search, Hash } from "lucide-react";
import ProblemService from "../Services/problemService";

const FilterSection = ({ filters, onFilterChange }) => {
  const [openTags, setOpenTags] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const response = await ProblemService.getAllTags();
        const tags = response.data.tags || [];
        setAvailableTags(tags.filter((tag) => tag)); // Filter out any null/empty tags
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags");
        setAvailableTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Search and Filters Row */}
      <Stack direction="row" spacing={2}>
        {/* Search Bar */}
        <TextField
          placeholder="Search problems..."
          value={filters.searchQuery || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, searchQuery: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="#FAF0CA" size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "40px",
              bgcolor: "#240046",
              color: "#FAF0CA",
              borderRadius: 1,
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              p: "8px 12px",
              "&::placeholder": {
                color: "#FAF0CA",
                opacity: 0.7,
              },
            },
          }}
        />

        {/* Difficulty Filter */}
        <Select
          value={filters.difficulty || "all"}
          onChange={(e) =>
            onFilterChange({ ...filters, difficulty: e.target.value })
          }
          sx={{
            width: "200px",
            height: "40px",
            bgcolor: "#240046",
            color: "#FAF0CA",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSvgIcon-root": { color: "#FAF0CA" },
          }}
        >
          <MenuItem value="all">All Difficulties</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>

        {/* Sort Filter */}
        <Select
          value={filters.sort || "newest"}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
          sx={{
            width: "200px",
            height: "40px",
            bgcolor: "#240046",
            color: "#FAF0CA",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSvgIcon-root": { color: "#FAF0CA" },
          }}
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
        </Select>
      </Stack>

      {/* Topics Section */}
      <Box
        onClick={() => setOpenTags(!openTags)}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1,
          mt: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#FAF0CA",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Hash size={16} />
          Topics ({availableTags.length})
        </Typography>
      </Box>

      {openTags && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 2,
            bgcolor: "rgba(60, 9, 108, 0.3)",
            borderRadius: 2,
          }}
        >
          {availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => {
                  const currentTags = filters.tags || [];
                  const newTags = currentTags.includes(tag)
                    ? currentTags.filter((t) => t !== tag)
                    : [...currentTags, tag];
                  onFilterChange({ ...filters, tags: newTags });
                }}
                sx={{
                  bgcolor: filters.tags?.includes(tag)
                    ? "rgba(157, 78, 221, 0.3)"
                    : "rgba(36, 0, 70, 0.5)",
                  color: "#FAF0CA",
                  border: "1px solid rgba(157, 78, 221, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(157, 78, 221, 0.2)",
                  },
                }}
              />
            ))
          ) : (
            <Typography
              sx={{ color: "#FAF0CA", opacity: 0.7, fontStyle: "italic" }}
            >
              {error ||
                (isLoading ? "Loading topics..." : "No topics available yet")}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FilterSection;
