import React from "react";
import { Box, Select, MenuItem, CircularProgress } from "@mui/material";
import { useEditor } from "../../context/editorContext";

const SUPPORTED_LANGUAGES = [
  { id: "cpp", label: "C++", icon: "⚡" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "java", label: "Java", icon: "☕" },
];

const LanguageSelector = () => {
  const { language, updateLanguage, error } = useEditor();
  const [isChanging, setIsChanging] = React.useState(false);

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setIsChanging(true);
    try {
      await updateLanguage(newLanguage);
    } catch (err) {
      console.error("Failed to change language:", err);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Select
      value={language || ""}
      onChange={handleLanguageChange}
      size="small"
      disabled={isChanging}
      displayEmpty
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
        width: "120px",
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
            "& .MuiMenuItem-root": {
              color: "#FAF0CA",
              fontSize: "13px",
              padding: "6px 12px",
            },
          },
        },
      }}
    >
      <MenuItem value="" sx={{ color: "#9D4EDD" }}>
        <em>Select Language</em>
      </MenuItem>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <MenuItem key={lang.id} value={lang.id}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isChanging && language === lang.id ? (
              <CircularProgress size={16} />
            ) : (
              <span style={{ fontSize: "12px" }}>{lang.icon}</span>
            )}
            {lang.label}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelector;
