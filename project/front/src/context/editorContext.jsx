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
  const { sessionId } = useParams();
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
        // Only create a new terminal if we don't have an active one for this language
        if (!terminals[newLanguage] || !terminals[newLanguage].active) {
          await createTerminalForLanguage(newLanguage);
        } else {
          setCurrentTerminal(terminals[newLanguage]);
        }
        setLanguage(newLanguage);
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
    code: language ? codeStates[language] : "",
    language,
    theme,
    testResults,
    currentTerminal,
    error,
    updateCode,
    updateLanguage,
    updateTheme,
    runTests,
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