// src/components/problem-interface/LanguageSelector.jsx
import React from "react";
import { Box, Select, MenuItem } from "@mui/material";
import { Code2 } from "lucide-react";
import { useEditor } from "../../context/editorContext";

const SUPPORTED_LANGUAGES = [
  { id: "python", label: "Python", icon: "🐍" },
  { id: "cpp", label: "C++", icon: "⚡" },
  { id: "java", label: "Java", icon: "☕" },
];

const LanguageSelector = () => {
  const { language, updateLanguage } = useEditor();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Code2 size={20} style={{ color: "#FAF0CA" }} />
      <Select
        value={language}
        onChange={(e) => updateLanguage(e.target.value)}
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
            },
          },
        }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <MenuItem key={lang.id} value={lang.id}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>{lang.icon}</span>
              {lang.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSelector;
