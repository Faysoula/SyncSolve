import React from "react";
import { Box, Stack, Button, Tooltip } from "@mui/material";
import Editor from "@monaco-editor/react";
import { Play, Save } from "lucide-react";
import { useEditor } from "../../context/editorContext";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

const EditorPanel = ({ onRunTests }) => {
  const {
    code,
    language,
    theme,
    updateCode,
    saveCodeSnapshot,
    isSaving,
    lastSaved,
  } = useEditor();

  return (
    <Stack
      spacing={0}
      sx={{
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 1,
          py: 0.5,
          borderBottom: "1px solid rgba(157, 78, 221, 0.2)",
          backgroundColor: theme.includes("light")
            ? "rgb(255, 255, 255, 0.05)"
            : "rgba(26, 22, 38, 0.6)",
          minHeight: "40px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side controls */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <LanguageSelector />
          <ThemeSelector />
          {lastSaved && (
            <Tooltip title={`Last saved: ${lastSaved.toLocaleTimeString()}`}>
              <Box
                sx={{
                  fontSize: "12px",
                  color: "#9D4EDD",
                  opacity: 0.8,
                }}
              >
                Saved
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Right side controls */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={saveCodeSnapshot}
            variant="outlined"
            disabled={isSaving || !language}
            startIcon={<Save size={16} />}
            sx={{
              color: "#9D4EDD",
              borderColor: "#9D4EDD",
              "&:hover": {
                borderColor: "#7B2CBF",
                backgroundColor: "rgba(157, 78, 221, 0.1)",
              },
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={onRunTests}
            variant="contained"
            startIcon={<Play size={16} />}
            sx={{
              bgcolor: "#7B2CBF",
              color: "#FAF0CA",
              borderRadius: 1.5,
              textTransform: "none",
              px: 2,
              py: 0.5,
              fontSize: "13px",
              minHeight: 0,
              "&:hover": {
                bgcolor: "#9D4EDD",
              },
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Run Tests
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, position: "relative" }}>
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={updateCode}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 1.5,
            padding: { top: 8, bottom: 8 },
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
            lineNumbersMinChars: -1,
            renderLineHighlight: "line",
            fontFamily: "JetBrains Mono, monospace",
            roundedSelection: false,
            renderIndentGuides: true,
            colorDecorators: true,
            bracketPairColorization: {
              enabled: true,
            },
            "semanticHighlighting.enabled": true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </Box>
    </Stack>
  );
};

export default EditorPanel;
