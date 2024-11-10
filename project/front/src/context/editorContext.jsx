import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { loader } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useAuth } from "./authContext";
import SessionTerminalService from "../Services/sessionService";
import SessionSnapshotService from "../Services/SessionSnapshotService";
import socketService from "../Services/socketService";
import { LANGUAGE_MAPPING, STARTING_CODE_TEMPLATES } from "../utils/constants";



const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  const { sessionId, problemId } = useParams();
  const { user } = useAuth();
  const [codeStates, setCodeStates] = useState({
    python: STARTING_CODE_TEMPLATES.python,
    cpp: STARTING_CODE_TEMPLATES.cpp,
    java: STARTING_CODE_TEMPLATES.java,
  });

  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [testResults, setTestResults] = useState(null);
  const [terminals, setTerminals] = useState({});
  const [currentTerminal, setCurrentTerminal] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [collaborators, setCollaborators] = useState(new Map());
  const editorRef = useRef(null);
  const isLocalChange = useRef(false);

  const [sharedCodeStates, setSharedCodeStates] = useState({
    python: STARTING_CODE_TEMPLATES.python,
    cpp: STARTING_CODE_TEMPLATES.cpp,
    java: STARTING_CODE_TEMPLATES.java,
  });

  

  useEffect(() => {
    if (sessionId && problemId && user) {
      socketService.connect();
      socketService.joinRoom(sessionId, problemId, user.user_id);

     socketService.onCodeChange(
       ({ code, language: codeLang, userId, cursorPosition }) => {
         if (userId !== user.user_id) {
           const editor = editorRef.current;
           if (editor && language === codeLang) {
             isLocalChange.current = true;

             // Save current position and selection
             const currentPosition = editor.getPosition();
             const currentSelection = editor.getSelection();

             // Update code
             setCodeStates((prev) => ({
               ...prev,
               [codeLang]: code,
             }));

             // Update collaborator cursor position
             setCollaborators((prev) => {
               const newMap = new Map(prev);
               const collaborator = newMap.get(userId) || {};
               newMap.set(userId, {
                 ...collaborator,
                 cursor: cursorPosition || collaborator.cursor,
               });
               return newMap;
             });

             // Restore position after code update
             setTimeout(() => {
               if (currentPosition) {
                 editor.setPosition(currentPosition);
               }
               if (currentSelection) {
                 editor.setSelection(currentSelection);
               }
               isLocalChange.current = false;
             }, 0);
           }
         }
       }
     );

      socketService.onCursorMove(({ position, userId }) => {
        if (userId !== user.user_id) {
          setCollaborators((prev) => {
            const newMap = new Map(prev);
            const collaborator = newMap.get(userId) || {};
            newMap.set(userId, {
              ...collaborator,
              cursor: position,
            });
            return newMap;
          });
        }
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [sessionId, problemId, user, language]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

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
  };

  useEffect(() => {
    setCodeStates({
      python: STARTING_CODE_TEMPLATES.python,
      cpp: STARTING_CODE_TEMPLATES.cpp,
      java: STARTING_CODE_TEMPLATES.java,
    });
    setSharedCodeStates({
      python: STARTING_CODE_TEMPLATES.python,
      cpp: STARTING_CODE_TEMPLATES.cpp,
      java: STARTING_CODE_TEMPLATES.java,
    });
  }, [problemId]);

  useEffect(() => {
    const loadSnapshots = async () => {
      if (!sessionId || !problemId) return;

      try {
        const snapshots = await SessionSnapshotService.getSnapshotsBySessionId(
          sessionId
        );
        const latestSnapshots = {};

        for (const snapshot of snapshots) {
          try {
            let parsedSnapshot;
            try {
              parsedSnapshot = JSON.parse(snapshot.code_snapshot);
            } catch (error) {
              console.log("Using legacy snapshot format");
              parsedSnapshot = {
                code: snapshot.code_snapshot,
                language: snapshot.language,
                problemId: snapshot.problem_id,
              };
            }

            const snapshotLang = parsedSnapshot.language;

            if (parsedSnapshot.problemId === problemId) {
              if (
                !latestSnapshots[snapshotLang] ||
                new Date(snapshot.created_at) >
                  new Date(latestSnapshots[snapshotLang].created_at)
              ) {
                let codeContent = parsedSnapshot.code;
                if (
                  typeof codeContent === "string" &&
                  codeContent.startsWith('"')
                ) {
                  try {
                    codeContent = JSON.parse(codeContent);
                  } catch (e) {
                    console.log("Using raw code string");
                  }
                }

                latestSnapshots[snapshotLang] = {
                  code: codeContent,
                  created_at: snapshot.created_at,
                };
              }
            }
          } catch (err) {
            console.error("Error processing snapshot:", err);
            continue;
          }
        }

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
          setLastSaved(new Date(latestSnapshots[language].created_at));
        }
      } catch (err) {
        console.error("Failed to load snapshots:", err);
      }
    };

    loadSnapshots();
  }, [sessionId, problemId, language]);

  const saveCodeSnapshot = async () => {
    if (!sessionId || !language || !problemId) {
      setError(
        "Cannot save code without a session, language, and problem selected"
      );
      return;
    }

    try {
      setIsSaving(true);
      const snapshotData = {
        language,
        problemId,
        code: codeStates[language],
        timestamp: new Date().toISOString(),
      };

      await SessionSnapshotService.createSnapshot(
        sessionId,
        JSON.stringify(snapshotData)
      );

      setLastSaved(new Date());
    } catch (err) {
      setError("Failed to save code snapshot");
      console.error("Save snapshot error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const createTerminalForLanguage = async (lang) => {
    if (!lang) return null;
    try {
      if (terminals[lang] && terminals[lang].active) {
        console.log(`Reusing existing terminal for ${lang}:`, terminals[lang]);
        setCurrentTerminal(terminals[lang]);
        return terminals[lang];
      }

      const terminalLanguage = LANGUAGE_MAPPING[lang];
      if (!terminalLanguage) {
        throw new Error(`Unsupported language: ${lang}`);
      }

      console.log(`Creating new terminal for ${lang}`);
      const response = await SessionTerminalService.createTerminal(
        sessionId,
        terminalLanguage
      );

      const newTerminals = {
        ...terminals,
        [lang]: response,
      };
      setTerminals(newTerminals);
      setCurrentTerminal(response);
      return response;
    } catch (err) {
      console.error("Failed to create terminal:", err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    if (sessionId && !isInitialized) {
      createTerminalForLanguage(language).then(() => {
        setIsInitialized(true);
      });
    }
  }, [sessionId, isInitialized]);

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

       // Emit both code and cursor position
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
          await createTerminalForLanguage(newLanguage);
        } else {
          setCurrentTerminal(terminals[newLanguage]);
        }
      } catch (err) {
        console.error("Error updating language:", err);
        setError(err.message);
      }
    },
    [language, terminals]
  );

  const updateTheme = useCallback((newTheme) => {
    loader.init().then((monaco) => {
      monaco.editor.setTheme(newTheme);
      setTheme(newTheme);
    });
  }, []);

  const runTests = useCallback(async () => {
    if (!currentTerminal) {
      setError("No active terminal session");
      return;
    }

    if (!language) {
      setError("Please select a programming language");
      return;
    }

    if (!user) {
      setError("You must be logged in to run tests");
      return;
    }

    try {
      setTestResults({ isLoading: true, results: null });

      const executionResponse = await SessionTerminalService.executeCode(
        user.user_id,
        codeStates[language],
        currentTerminal.terminal_id
      );

      const { execution, runResult } = executionResponse;

      setTestResults({
        isLoading: false,
        allPassed: runResult.allPassed,
        results: runResult.results,
        executionId: execution.execution_id,
      });
    } catch (error) {
      console.error("Test execution failed:", error);
      setTestResults({
        isLoading: false,
        error: error.message || "Failed to execute tests",
      });
    }
  }, [language, codeStates, currentTerminal, user]);

  const value = {
    code: codeStates[language] || STARTING_CODE_TEMPLATES[language],
    language,
    theme,
    testResults,
    currentTerminal,
    error,
    isSaving,
    lastSaved,
    updateCode,
    updateLanguage,
    updateTheme,
    runTests,
    saveCodeSnapshot,
    collaborators,
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
