/**
 * Custom hook for managing editor state in a collaborative coding environment.
 * @returns {Object} An object containing various editor state variables and their setters:
 * @property {Object} codeStates - Object containing code states for different files/tabs
 * @property {Function} setCodeStates - Setter function for codeStates
 * @property {string} language - Current programming language
 * @property {Function} setLanguage - Setter function for language
 * @property {string} theme - Current editor theme
 * @property {Function} setTheme - Setter function for theme
 * @property {Object|null} testResults - Results from code testing
 * @property {Function} setTestResults - Setter function for testResults
 * @property {Object} terminals - Object containing terminal instances
 * @property {Function} setTerminals - Setter function for terminals
 * @property {Object|null} currentTerminal - Currently active terminal
 * @property {Function} setCurrentTerminal - Setter function for currentTerminal
 * @property {Error|null} error - Current error state
 * @property {Function} setError - Setter function for error
 * @property {boolean} isInitialized - Editor initialization state
 * @property {Function} setIsInitialized - Setter function for isInitialized
 * @property {boolean} isSaving - Indicates if editor is currently saving
 * @property {Function} setIsSaving - Setter function for isSaving
 * @property {Date|null} lastSaved - Timestamp of last save
 * @property {Function} setLastSaved - Setter function for lastSaved
 * @property {Map} collaborators - Map of current collaborators
 * @property {Function} setCollaborators - Setter function for collaborators
 * @property {React.MutableRefObject} editorRef - Reference to the editor component
 * @property {React.MutableRefObject<boolean>} isLocalChange - Flag indicating if change is local
 */
import { useState, useRef } from "react";
import { STARTING_CODE_TEMPLATES } from "../utils/constants";

export const useEditorState = () => {
  const [codeStates, setCodeStates] = useState({});
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
