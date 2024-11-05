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
    <Select
      value={language}
      onChange={(e) => updateLanguage(e.target.value)}
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
        width: "120px", // Smaller width
        height: "32px", // Smaller height
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
            "& .MuiMenuItem-root": {
              color: "#FAF0CA",
              fontSize: "13px",
              padding: "6px 12px",
            },
          },
        },
      }}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <MenuItem key={lang.id} value={lang.id}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span style={{ fontSize: "12px" }}>{lang.icon}</span>
            {lang.label}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelector;
