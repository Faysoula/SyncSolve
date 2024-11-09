import React, { useRef, useEffect, memo, useCallback } from "react";
import { Box, Stack, Button } from "@mui/material";
import Editor from "@monaco-editor/react";
import { Play, Save } from "lucide-react";
import { useEditor } from "../../context/editorContext";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

// Create a memoized Editor component to prevent unnecessary re-renders
const CodeEditor = memo(
  ({ language, theme, code, onChange, onMount, options }) => (
    <Editor
      height="100%"
      language={language}
      theme={theme}
      value={code}
      onChange={onChange}
      onMount={onMount}
      options={options}
    />
  )
);

CodeEditor.displayName = "CodeEditor";

const EditorPanel = ({ onRunTests }) => {
  const {
    code,
    language,
    theme,
    updateCode,
    saveCodeSnapshot,
    isSaving,
    lastSaved,
    handleEditorDidMount,
    collaborators,
  } = useEditor();

  const decorationsRef = useRef([]);
  const editorRef = useRef(null);

  // Memoize the updateDecorations function
  const updateDecorations = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        Array.from(collaborators.values())
          .filter((c) => c.cursor)
          .map((collaborator, index) => ({
            range: {
              startLineNumber: collaborator.cursor.lineNumber,
              startColumn: collaborator.cursor.column,
              endLineNumber: collaborator.cursor.lineNumber,
              endColumn: collaborator.cursor.column + 1,
            },
            options: {
              className: `collaborator-cursor cursor-${index}`,
              hoverMessage: { value: `Collaborator ${index + 1}` },
              beforeContentClassName: `cursor-${index}-before`,
              afterContentClassName: `cursor-${index}-after`,
            },
          }))
      );
    }
  }, [collaborators]);

  // Use effect for cursor updates
  useEffect(() => {
    updateDecorations();
  }, [updateDecorations]);

  const handleEditorMount = useCallback(
    (editor) => {
      editorRef.current = editor;
      handleEditorDidMount(editor);
    },
    [handleEditorDidMount]
  );

  // Memoize editor options
  const editorOptions = {
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
  };

  // Memoize button handlers
  const handleSave = useCallback(() => {
    saveCodeSnapshot();
  }, [saveCodeSnapshot]);

  const handleRunTests = useCallback(() => {
    onRunTests();
  }, [onRunTests]);

  return (
    <Stack
      spacing={0}
      sx={{
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>
        {`
          .collaborator-cursor {
            background: transparent !important;
            border-left: 2px solid;
            width: 0 !important;
          }
          .cursor-0-before { border-color: #ff0000; }
          .cursor-1-before { border-color: #00ff00; }
          .cursor-2-before { border-color: #0000ff; }
          .cursor-3-before { border-color: #ffff00; }
          
          .cursor-0-after {
            content: '';
            position: absolute;
            top: -20px;
            font-size: 12px;
            padding: 2px 4px;
            background: #ff0000;
            color: white;
            border-radius: 3px;
            z-index: 1000;
          }
          .cursor-1-after {
            content: '';
            position: absolute;
            top: -20px;
            font-size: 12px;
            padding: 2px 4px;
            background: #00ff00;
            color: white;
            border-radius: 3px;
            z-index: 1000;
          }
          .cursor-2-after {
            content: '';
            position: absolute;
            top: -20px;
            font-size: 12px;
            padding: 2px 4px;
            background: #0000ff;
            color: white;
            border-radius: 3px;
            z-index: 1000;
          }
          .cursor-3-after {
            content: '';
            position: absolute;
            top: -20px;
            font-size: 12px;
            padding: 2px 4px;
            background: #ffff00;
            color: black;
            border-radius: 3px;
            z-index: 1000;
          }
        `}
      </style>
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
            <Box
              sx={{
                fontSize: "12px",
                color: "#9D4EDD",
                opacity: 0.8,
              }}
            >
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </Box>
          )}
        </Box>

        {/* Right side controls */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleSave}
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
            onClick={handleRunTests}
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
        <CodeEditor
          language={language}
          theme={theme}
          code={code}
          onChange={updateCode}
          onMount={handleEditorMount}
          options={editorOptions}
        />
      </Box>
    </Stack>
  );
};


export default memo(EditorPanel);