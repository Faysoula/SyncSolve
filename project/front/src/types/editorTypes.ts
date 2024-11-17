import { Monaco } from "@monaco-editor/react";

export interface CodeStates {
  python: string;
  cpp: string;
  java: string;
}

export interface CollaboratorInfo {
  cursor?: {
    lineNumber: number;
    column: number;
  };
}

export interface TestResult {
  isLoading?: boolean;
  allPassed?: boolean;
  results?: any[];
  executionId?: string;
  error?: string;
}

export interface Terminal {
  terminal_id: number;
  active: boolean;
  language: string;
}

export interface EditorContextState {
  code: string;
  language: string;
  theme: string;
  testResults: TestResult | null;
  currentTerminal: Terminal | null;
  error: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
  collaborators: Map<string, CollaboratorInfo>;
}

export interface EditorContextValue extends EditorContextState {
  updateCode: (code: string) => void;
  updateLanguage: (language: string) => Promise<void>;
  updateTheme: (theme: string) => void;
  runTests: () => Promise<void>;
  saveCodeSnapshot: () => Promise<void>;
  handleEditorDidMount: (editor: any) => void;
}