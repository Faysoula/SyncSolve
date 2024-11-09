import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { loader } from "@monaco-editor/react";
import { importThemes } from "../utils/editorThemes";
import { useParams } from "react-router-dom";
import { useAuth } from "./authContext";
import SessionTerminalService from "../Services/sessionService";
import SessionSnapshotService from "../Services/SessionSnapshotService";

const LANGUAGE_MAPPING = {
  cpp: "Cpp",
  python: "Python",
  java: "Java",
};

const STARTING_CODE_TEMPLATES = {
  python: `def solution():
    # Write your solution here
    pass`,

  cpp: `#include <vector>
#include <string>
#include <iostream>
using namespace std;

class Solution {
public:
    void solve() {
        // Write your solution here
        cout << "Hello World!" << endl;
    }
};

int main() {
    Solution solution;
    solution.solve();
    return 0;
}`,

  java: `public class Solution {
    public void solve() {
        // Write your solution here
        System.out.println("Hello World!");
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        solution.solve();
    }
}`,
};

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

  useEffect(() => {
    setCodeStates({
      python: STARTING_CODE_TEMPLATES.python,
      cpp: STARTING_CODE_TEMPLATES.cpp,
      java: STARTING_CODE_TEMPLATES.java,
    });
  }, [problemId]);

  useEffect(() => {
    const loadSnapshots = async () => {
      if (!sessionId || !language || !problemId) return;

      try {
        const snapshots = await SessionSnapshotService.getSnapshotsBySessionId(
          sessionId
        );
        const relevantSnapshots = snapshots.filter((snap) => {
          try {
            const parsedSnapshot = JSON.parse(snap.code_snapshot);
            return (
              parsedSnapshot.language === language &&
              parsedSnapshot.problemId === problemId
            ); // Filter by both language and problemId
          } catch (e) {
            return false;
          }
        });

        // Get the most recent snapshot for this problem and language
        if (relevantSnapshots.length > 0) {
          const latestSnapshot = relevantSnapshots.reduce((latest, current) => {
            return new Date(current.created_at) > new Date(latest.created_at)
              ? current
              : latest;
          });

          const parsedSnapshot = JSON.parse(latestSnapshot.code_snapshot);
          setCodeStates((prev) => ({
            ...prev,
            [language]: parsedSnapshot.code,
          }));
          setLastSaved(new Date(latestSnapshot.created_at));
        } else {
          // If no snapshot found, set to template code
          setCodeStates((prev) => ({
            ...prev,
            [language]: STARTING_CODE_TEMPLATES[language],
          }));
          setLastSaved(null);
        }
      } catch (err) {
        console.error("Failed to load snapshots:", err);
      }
    };

    loadSnapshots();
  }, [sessionId, language, problemId]);

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
        problemId, // Include problemId in snapshot data
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
      // Check if we already have a terminal for this language
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

  // Initialize terminal only once on mount
  useEffect(() => {
    if (sessionId && !isInitialized) {
      createTerminalForLanguage(language).then(() => {
        setIsInitialized(true);
      });
    }
  }, [sessionId, isInitialized]);

  const updateCode = useCallback(
    (newCode) => {
      if (!language) return;
      setCodeStates((prev) => ({
        ...prev,
        [language]: newCode,
      }));
    },
    [language]
  );

  const updateLanguage = useCallback(
    async (newLanguage) => {
      if (newLanguage === language) return;

      try {
        // Set language first
        setLanguage(newLanguage);

        // If there's a problemId, try to load existing snapshot
        if (problemId && sessionId) {
          const snapshots =
            await SessionSnapshotService.getSnapshotsBySessionId(sessionId);
          const relevantSnapshots = snapshots.filter((snap) => {
            try {
              const parsedSnapshot = JSON.parse(snap.code_snapshot);
              return (
                parsedSnapshot.language === newLanguage &&
                parsedSnapshot.problemId === problemId
              );
            } catch (e) {
              return false;
            }
          });

          if (relevantSnapshots.length > 0) {
            const latestSnapshot = relevantSnapshots.reduce(
              (latest, current) => {
                return new Date(current.created_at) >
                  new Date(latest.created_at)
                  ? current
                  : latest;
              }
            );

            const parsedSnapshot = JSON.parse(latestSnapshot.code_snapshot);
            setCodeStates((prev) => ({
              ...prev,
              [newLanguage]: parsedSnapshot.code,
            }));
            setLastSaved(new Date(latestSnapshot.created_at));
          } else {
            // If no snapshot found, use template code
            setCodeStates((prev) => ({
              ...prev,
              [newLanguage]: STARTING_CODE_TEMPLATES[newLanguage],
            }));
            setLastSaved(null);
          }
        }

        // Create new terminal if needed
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
    [language, terminals, problemId, sessionId]
  );

  const updateTheme = useCallback((newTheme) => {
    loader.init().then((monaco) => {
      monaco.editor.setTheme(newTheme);
      setTheme(newTheme);
    });
  }, []);

  const runTests = useCallback(
    async () => {
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
    },
    [language, codeStates, currentTerminal, user] // Add user to dependencies
  );

  const value = {
    code: codeStates[language],
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