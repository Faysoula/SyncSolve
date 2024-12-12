/**
 * A collaborative code editor panel component with real-time cursor tracking and AI assistance.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onRunTests - Callback function to execute when running tests
 * @param {Object} props.problem - Problem object containing details about the current coding problem
 * 
 * @returns {JSX.Element} A stack layout containing:
 * - Editor controls (language selector, theme selector, save/run buttons)
 * - Monaco code editor with collaborative cursors
 * - AI Assistant panel
 * 
 * Features:
 * - Real-time collaborative cursor tracking
 * - Multiple theme support
 * - Multiple language support
 * - Auto-save functionality
 * - AI assistance
 * - Test execution
 * 
 * Uses monaco-editor for the code editing interface and maintains cursor decorations
 * for real-time collaboration. Implements custom styling for collaborator cursors
 * with unique colors for different users.
 */
import React, { useRef, useState, useEffect, memo, useCallback } from "react";
import { Box, Stack, Button } from "@mui/material";
import { Play, Save, Terminal, Brain } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useEditor } from "../../context/editorContext";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import AiAssistant from "./AiAssistant";
import * as monaco from "monaco-editor";

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

const EditorPanel = ({ onRunTests, problem }) => {
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

  const updateDecorations = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      const lineCount = model.getLineCount();

      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        Array.from(collaborators.values())
          .filter((c) => c.cursor)
          .map((collaborator, index) => {
            const position = collaborator.cursor;

            // Validate line number is within bounds
            if (
              !position ||
              position.lineNumber < 1 ||
              position.lineNumber > lineCount
            ) {
              return null;
            }

            // Safely get line content with validation
            let lineContent;
            try {
              lineContent = model.getLineContent(position.lineNumber);
            } catch (e) {
              console.warn("Error getting line content:", e);
              return null;
            }

            // Validate column is within bounds
            const maxColumn = model.getLineMaxColumn(position.lineNumber);
            const safeColumn = Math.min(
              Math.max(1, position.column),
              maxColumn
            );

            return {
              range: {
                startLineNumber: position.lineNumber,
                startColumn: safeColumn,
                endLineNumber: position.lineNumber,
                endColumn: safeColumn + 1,
              },
              options: {
                className: `collaborator-cursor cursor-${index}-before`,
                hoverMessage: null,
                beforeContentClassName: `cursor-${index}-before`,
                stickiness:
                  monaco.editor.TrackedRangeStickiness
                    .NeverGrowsWhenTypingAtEdges,
              },
            };
          })
          .filter(Boolean)
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
    fontSize: 15,
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
      position: relative;
      transition: all 0.1s ease-in-out;
    }

    /* Cursor styles with unique colors for each user */
    .cursor-0-before { 
      border-color: #FF5D8F;
      box-shadow: 0 0 8px rgba(255, 93, 143, 0.4);
    }
    .cursor-1-before { 
      border-color: #00FFB3;
      box-shadow: 0 0 8px rgba(0, 255, 179, 0.4);
    }
    .cursor-2-before { 
      border-color: #00B8FF;
      box-shadow: 0 0 8px rgba(0, 184, 255, 0.4);
    }
    .cursor-3-before { 
      border-color: #FFB800;
      box-shadow: 0 0 8px rgba(255, 184, 0, 0.4);
    }
    
    /* User labels */
    .cursor-label {
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 1000;
      font-family: 'Inter', sans-serif;
      transform: translateY(-2px);
      opacity: 0.9;
      transition: all 0.1s ease-in-out;
    }

    .cursor-0-after {
      background: #FF5D8F;
      color: white;
      box-shadow: 0 2px 4px rgba(255, 93, 143, 0.3);
    }
    
    .cursor-1-after {
      background: #00FFB3;
      color: black;
      box-shadow: 0 2px 4px rgba(0, 255, 179, 0.3);
    }
    
    .cursor-2-after {
      background: #00B8FF;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 184, 255, 0.3);
    }
    
    .cursor-3-after {
      background: #FFB800;
      color: black;
      box-shadow: 0 2px 4px rgba(255, 184, 0, 0.3);
    }

    /* Cursor animation */
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .collaborator-cursor {
      animation: cursorBlink 1s ease-in-out infinite;
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

      <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Editor */}
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

        {/* AI Assistant Panel */}
        <Box
          sx={{
            width: "300px",
            borderLeft: "1px solid rgba(157, 78, 221, 0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AiAssistant code={code} problem={problem} />
        </Box>
      </Box>
    </Stack>
  );
};

export default memo(EditorPanel);
