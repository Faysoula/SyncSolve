// ThemeSelector.jsx
import React from "react";
import { Select, MenuItem } from "@mui/material";
import { useEditor } from "../../context/editorContext";

// Theme categories for organization
const THEME_CATEGORIES = {
  "Dark Themes": [
    "vs-dark",
    "dracula",
    "monokai",
    "github-dark",
    "night-owl",
    "nord",
    "solarized-dark",
    "tomorrow-night",
  ],
  "Light Themes": [
    "github-light",
    "solarized-light",
    "tomorrow",
    "xcode-default",
  ],
  "Colorful Themes": ["cobalt", "twilight", "vibrant-ink", "birds-of-paradise"],
};

const ThemeSelector = () => {
  const { theme, updateTheme } = useEditor();

  // Helper function to format theme name for display
  const formatThemeName = (themeName) => {
    return themeName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Select
      value={theme}
      onChange={(e) => updateTheme(e.target.value)}
      sx={{
        color: "#FAF0CA",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#5A189A",
        },
        bgcolor: "#240046",
        width: "200px",
        borderRadius: "12px",
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: "#240046",
            "& .MuiMenuItem-root": {
              color: "#FAF0CA",
            },
            maxHeight: 300,
          },
        },
      }}
    >
      {Object.entries(THEME_CATEGORIES)
        .map(([category, themes]) => [
          <MenuItem
            key={category}
            disabled
            sx={{
              opacity: 0.7,
              fontSize: "0.9rem",
              fontWeight: "bold",
              bgcolor: "rgba(157, 78, 221, 0.1) !important",
            }}
          >
            {category}
          </MenuItem>,
          ...themes.map((themeName) => (
            <MenuItem
              key={themeName}
              value={themeName}
              sx={{
                pl: 4,
                "&:hover": {
                  bgcolor: "rgba(157, 78, 221, 0.2)",
                },
              }}
            >
              {formatThemeName(themeName)}
            </MenuItem>
          )),
        ])
        .flat()}
    </Select>
  );
};

export default ThemeSelector;
