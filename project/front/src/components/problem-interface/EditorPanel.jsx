import React from "react";
import { Box, Stack } from "@mui/material";
import { Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/editorContext";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

const EditorPanel = ({ onRunTests }) => {
  const { code, language, theme, updateCode } = useEditor();

  return (
    <Stack spacing={3} sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <LanguageSelector />
        <ThemeSelector />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: "60vh",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #5A189A",
          "& .monaco-editor": {
            borderRadius: "16px !important",
            overflow: "hidden",
          },
        }}
      >
        <Editor
          height="60vh"
          language={language}
          theme={theme}
          value={code}
          onChange={updateCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            renderLineHighlight: "all",
            highlightActiveIndentGuide: true,
            contextmenu: true,
            folding: true,
            showFoldingControls: "always",
            roundedSelection: true,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: true,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <button
          onClick={onRunTests}
          style={{
            background: "linear-gradient(45deg, #7B2CBF 30%, #9D4EDD 90%)",
            border: 0,
            borderRadius: "12px",
            color: "#FAF0CA",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            transition: "all 0.3s ease",
            boxShadow: "0 3px 15px rgba(157, 78, 221, 0.3)",
          }}
        >
          <Play size={20} />
          Run Tests
        </button>
      </Box>
    </Stack>
  );
};

export default EditorPanel;
