import { useState, useRef } from "react";
import { STARTING_CODE_TEMPLATES } from "../utils/constants";

export const useEditorState = () => {
  const [codeStates, setCodeStates] = useState({
    python: STARTING_CODE_TEMPLATES.python,
    cpp: STARTING_CODE_TEMPLATES.cpp,
    java: STARTING_CODE_TEMPLATES.java,
  });

  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("monokai");
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

  return {
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
  };
};
