// components/problem-interface/ThemeSelector.jsx
import React from "react";
import { Box, Select, MenuItem } from "@mui/material";
import { useEditor } from "../../context/editorContext";

const THEME_CATEGORIES = {
  "Dark Themes": [
    { id: "dracula", label: "Dracula", icon: "🧛" },
    { id: "github-dark", label: "GitHub Dark", icon: "🐱" },
    { id: "monokai", label: "Monokai", icon: "🌙" },
    { id: "nord", label: "Nord", icon: "❄️" },
    { id: "vs-dark", label: "VS Dark", icon: "🌑" },
  ],
  "Light Themes": [
    { id: "github-light", label: "GitHub Light", icon: "🐱" },
    { id: "vs", label: "VS Light", icon: "☀️" },
    { id: "solarized-light", label: "Solarized", icon: "🌞" },
  ],
};

const ThemeSelector = () => {
  const { theme, updateTheme } = useEditor();

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    updateTheme(newTheme);
  };

  return (
    <Select
      value={theme || "vs-dark"}
      onChange={handleThemeChange}
      size="small"
      sx={{
        color: "#FAF0CA",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(157, 78, 221, 0.3)",
          borderWidth: "1px",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(157, 78, 221, 0.5)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(157, 78, 221, 0.7)",
        },
        backgroundColor: "rgba(26, 22, 38, 0.4)",
        width: "150px",
        height: "32px",
        "& .MuiSelect-select": {
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: "#1A1626",
            maxHeight: "300px",
            "& .MuiMenuItem-root": {
              color: "#FAF0CA",
              fontSize: "13px",
              padding: "6px 12px",
            },
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
              fontSize: "12px !important",
              fontWeight: "600",
              bgcolor: "rgba(157, 78, 221, 0.1) !important",
              py: 1,
            }}
          >
            {category}
          </MenuItem>,
          ...themes.map((themeOption) => (
            <MenuItem
              key={themeOption.id}
              value={themeOption.id}
              sx={{
                pl: 3,
                "&:hover": {
                  bgcolor: "rgba(157, 78, 221, 0.2)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: "12px" }}>{themeOption.icon}</span>
                {themeOption.label}
              </Box>
            </MenuItem>
          )),
        ])
        .flat()}
    </Select>
  );
};

export default ThemeSelector;