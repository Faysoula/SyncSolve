import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { loader } from "@monaco-editor/react";
import { importThemes } from "../utils/editorThemes";

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
  const [codeStates, setCodeStates] = useState({
    python: STARTING_CODE_TEMPLATES.python,
    cpp: STARTING_CODE_TEMPLATES.cpp,
    java: STARTING_CODE_TEMPLATES.java,
  });

  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [testResults, setTestResults] = useState(null);

  // Initialize Monaco and themes
  useEffect(() => {
    const initializeMonaco = async () => {
      const monaco = await loader.init();
      const themes = await importThemes();

      // Register all themes with Monaco
      Object.entries(themes).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, themeData);
      });
    };

    initializeMonaco();
  }, []);

  const updateCode = useCallback(
    (newCode) => {
      setCodeStates((prev) => ({
        ...prev,
        [language]: newCode,
      }));
    },
    [language]
  );

  const updateLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);

  const updateTheme = useCallback((newTheme) => {
    // Set the theme for the editor
    loader.init().then((monaco) => {
      monaco.editor.setTheme(newTheme);
      setTheme(newTheme);
    });
  }, []);

  const runTests = useCallback(
    async (problemId) => {
      try {
        const currentCode = codeStates[language];
        console.log(
          "Running tests for problem:",
          problemId,
          "with code:",
          currentCode
        );

        setTestResults({
          results: [
            { passed: true, output: "[0,1]" },
            { passed: false, output: "[1,3]" },
          ],
        });
      } catch (error) {
        console.error("Test execution failed:", error);
        throw error;
      }
    },
    [language, codeStates]
  );

  const value = {
    code: codeStates[language],
    language,
    theme,
    testResults,
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
