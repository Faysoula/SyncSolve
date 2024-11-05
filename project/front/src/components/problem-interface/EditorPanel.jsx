import React from "react";
import { Box, Stack, Button } from "@mui/material";
import { Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/editorContext";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

const EditorPanel = ({ onRunTests }) => {
  const { code, language, theme, updateCode } = useEditor();

  return (
    <Stack spacing={0} sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 1,
          borderBottom: "1px solid rgba(157, 78, 221, 0.2)",
        }}
      >
        <LanguageSelector />
        <ThemeSelector />
      </Box>

      <Box
        sx={{
          flex: 1,
          position: "relative",
          "& .monaco-editor": {
            ".margin": {
              background: "transparent !important",
            },
          },
        }}
      >
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={updateCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 1.6,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            contextmenu: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: true,
            folding: true,
            lineNumbers: "on",
            renderLineHighlight: "all",
            fontFamily: "JetBrains Mono, monospace",
          }}
        />
      </Box>

      <Button
        onClick={onRunTests}
        variant="contained"
        startIcon={<Play size={18} />}
        sx={{
          mt: 2,
          bgcolor: "#7B2CBF",
          color: "#FAF0CA",
          borderRadius: 2,
          textTransform: "none",
          px: 3,
          py: 1.5,
          "&:hover": {
            bgcolor: "#9D4EDD",
          },
          alignSelf: "flex-end",
        }}
      >
        Run Tests
      </Button>
    </Stack>
  );
};

export default EditorPanel;
