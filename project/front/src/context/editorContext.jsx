import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { loader } from "@monaco-editor/react";
import { defineThemes, setEditorTheme } from "../Services/themeService";
import { useParams } from "react-router-dom";
import { useAuth } from "./authContext";
import { useEditorState } from "../hooks/useEditorState";
import { useCollaboration } from "../hooks/useCollaboration";
import { STARTING_CODE_TEMPLATES, generateStartingCode } from "../utils/constants";
import socketService from "../Services/socketService";
import {
  createTerminalForLanguage,
  saveSnapshot,
  loadSnapshots,
} from "../Services/editorService";
import SessionTerminalService from "../Services/sessionService";
import ProblemService from "../Services/problemService";

const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  const { sessionId, problemId } = useParams();
  const { user } = useAuth();
  const editorState = useEditorState();

  const {
    codeStates,
    setCodeStates,
    language,
    setLanguage,
    theme,
    setTheme,
    testResults,
    setTestResults,
    terminals,
    setTerminals,
    currentTerminal,
    setCurrentTerminal,
    error,
    setError,
    isInitialized,
    setIsInitialized,
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    collaborators,
    setCollaborators,
    editorRef,
    isLocalChange,
  } = editorState;

  // Set up collaboration
  useCollaboration({
    sessionId,
    problemId,
    user,
    language,
    setCodeStates,
    setCollaborators,
    editorRef,
    isLocalChange,
  });

  const handleEditorDidMount = useCallback(
    (editor) => {
      editorRef.current = editor;

      // Initialize themes and set initial theme
      defineThemes()
        .then(() => {
          setEditorTheme(theme, editor);
        })
        .catch(console.error);

      let cursorUpdateTimeout;
      editor.onDidChangeCursorPosition((e) => {
        if (!isLocalChange.current) {
          if (cursorUpdateTimeout) {
            clearTimeout(cursorUpdateTimeout);
          }

          cursorUpdateTimeout = setTimeout(() => {
            socketService.emitCursorMove(
              {
                lineNumber: e.position.lineNumber,
                column: e.position.column,
              },
              user.user_id
            );
          }, 50);
        }
      });
    },
    [theme, user?.user_id]
  );

  useEffect(() => {
    const initializeCodeStates = async () => {
      if (problemId) {
        try {
          // Fetch problem details
          const response = await ProblemService.getProblemById(problemId);
          const problem = response.data;

          // Generate appropriate starting code for each language
          setCodeStates({
            cpp: generateStartingCode("cpp", problem.test_cases),
            python: STARTING_CODE_TEMPLATES.python,
            java: STARTING_CODE_TEMPLATES.java,
          });
        } catch (err) {
          console.error("Error initializing code states:", err);
        }
      }
    };

    initializeCodeStates();
  }, [problemId]);

  const updateTheme = useCallback(async (newTheme) => {
    try {
      const success = await setEditorTheme(newTheme, editorRef.current);
      if (success) {
        setTheme(newTheme);
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  }, []);

  const updateCode = useCallback(
    (newCode) => {
      if (!isLocalChange.current && language) {
        isLocalChange.current = true;
        const editor = editorRef.current;
        const currentPosition = editor?.getPosition();
        const currentSelection = editor?.getSelection();

        setCodeStates((prev) => ({
          ...prev,
          [language]: newCode,
        }));

        socketService.emitCodeChange(
          newCode,
          language,
          user.user_id,
          currentPosition
        );

        setTimeout(() => {
          if (editor && currentPosition) {
            editor.setPosition(currentPosition);
            if (currentSelection) {
              editor.setSelection(currentSelection);
            }
          }
          isLocalChange.current = false;
        }, 0);
      }
    },
    [language, user]
  );

  const updateLanguage = useCallback(
    async (newLanguage) => {
      if (newLanguage === language) return;
      try {
        setLanguage(newLanguage);
        if (!terminals[newLanguage] || !terminals[newLanguage].active) {
          await createTerminalForLanguage(
            newLanguage,
            sessionId,
            terminals,
            setTerminals,
            setCurrentTerminal,
            setError
          );
        } else {
          setCurrentTerminal(terminals[newLanguage]);
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [language, terminals, sessionId]
  );

  useEffect(() => {
    const loadSnapshotsData = async () => {
      if (!sessionId || !problemId) return;

      try {
        const latestSnapshots = await loadSnapshots(sessionId, problemId);

        setCodeStates((prev) => {
          const newStates = { ...prev };
          Object.entries(latestSnapshots).forEach(([lang, data]) => {
            if (data.code) {
              newStates[lang] = data.code;
            }
          });
          return newStates;
        });

        if (language && latestSnapshots[language]) {
          setLastSaved(latestSnapshots[language].timestamp);
        }
      } catch (err) {
        setError("Failed to load saved code: " + err.message);
      }
    };

    loadSnapshotsData();
  }, [sessionId, problemId, language]);

  const saveCodeSnapshot = useCallback(async () => {
    if (!sessionId || !language || !problemId || !codeStates[language]) {
      setError("Cannot save: Missing required data");
      return;
    }

    try {
      await saveSnapshot(
        sessionId,
        language,
        problemId,
        codeStates[language],
        setError,
        setIsSaving,
        setLastSaved
      );
      console.log("Code saved successfully");
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, [sessionId, language, problemId, codeStates]);

  const runTests = useCallback(async () => {
    if (!currentTerminal || !language || !user) {
      setError("Missing required configuration");
      return;
    }

    try {
      setTestResults({ isLoading: true, results: null });

      const response = await SessionTerminalService.executeCode(
        user.user_id,
        codeStates[language],
        currentTerminal.terminal_id
      );

      // Check if we have a valid response
      if (!response || !response.runResult) {
        throw new Error("Invalid response from execution service");
      }

      const { runResult, execution } = response;

      setTestResults({
        isLoading: false,
        allPassed: Boolean(runResult.allPassed),
        results: runResult.results || [],
        executionId: execution?.execution_id,
        error: runResult.error || null,
      });
    } catch (error) {
      console.error("Test execution error:", error);
      setTestResults({
        isLoading: false,
        allPassed: false,
        results: [],
        error: error.message || "Failed to execute tests",
      });
    }
  }, [language, codeStates, currentTerminal, user]);

  useEffect(() => {
    if (!sessionId || !language || !codeStates[language]) return;

    const autoSaveInterval = setInterval(() => {
      if (!isSaving) {
        saveCodeSnapshot().catch(console.error);
      }
    }, 300000);

    return () => clearInterval(autoSaveInterval);
  }, [sessionId, language, codeStates, isSaving, saveCodeSnapshot]);

  const value = {
    code: codeStates[language] || STARTING_CODE_TEMPLATES[language],
    language,
    theme,
    testResults,
    currentTerminal,
    error,
    isSaving,
    lastSaved,
    collaborators,
    updateCode,
    updateLanguage,
    updateTheme,
    runTests,
    saveCodeSnapshot,
    handleEditorDidMount,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
