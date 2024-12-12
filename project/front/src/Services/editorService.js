import { loader } from "@monaco-editor/react";
import SessionTerminalService from "../Services/sessionService";
import SessionSnapshotService from "../Services/SessionSnapshotService";
import { LANGUAGE_MAPPING } from "../utils/constants";

// Create a terminal for the given language
export const createTerminalForLanguage = async (
  lang,
  sessionId,
  terminals,
  setTerminals,
  setCurrentTerminal,
  setError
) => {
  if (!lang) return null;
  try {
    if (terminals[lang] && terminals[lang].active) {
      setCurrentTerminal(terminals[lang]);
      return terminals[lang];
    }

    const terminalLanguage = LANGUAGE_MAPPING[lang];
    if (!terminalLanguage) {
      throw new Error(`Unsupported language: ${lang}`);
    }

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
    setError(err.message);
    return null;
  }
};

// Get the terminal for the given language
export const saveSnapshot = async (
  sessionId,
  language,
  problemId,
  code,
  setError,
  setIsSaving,
  setLastSaved
) => {
  if (!sessionId || !language || !problemId) {
    throw new Error(
      "Cannot save code without a session, language, and problem selected"
    );
  }

  try {
    setIsSaving(true);

    // Create snapshot data object
    const snapshotData = {
      language,
      problemId,
      code,
      timestamp: new Date().toISOString(),
    };

    // Convert to string and save
    await SessionSnapshotService.createSnapshot(
      sessionId,
      JSON.stringify(snapshotData)
    );

    setLastSaved(new Date());
    return true;
  } catch (err) {
    console.error("Save error:", err);
    setError("Failed to save code snapshot: " + err.message);
    throw err;
  } finally {
    setIsSaving(false);
  }
};

// Load the latest code snapshots for the given session and problem
export const loadSnapshots = async (sessionId, problemId) => {
  try {
    const snapshots = await SessionSnapshotService.getSnapshotsBySessionId(
      sessionId
    );
    const latestSnapshots = {};

    for (const snapshot of snapshots) {
      try {
        let parsedSnapshot = JSON.parse(snapshot.code_snapshot);

        // Validate snapshot data
        if (!parsedSnapshot.language || !parsedSnapshot.code) {
          console.warn("Invalid snapshot format:", snapshot);
          continue;
        }

        // Only process snapshots for current problem
        if (parsedSnapshot.problemId === problemId) {
          const currentTimestamp = new Date(snapshot.created_at);
          const existingTimestamp =
            latestSnapshots[parsedSnapshot.language]?.timestamp;

          if (!existingTimestamp || currentTimestamp > existingTimestamp) {
            latestSnapshots[parsedSnapshot.language] = {
              code: parsedSnapshot.code,
              timestamp: currentTimestamp,
            };
          }
        }
      } catch (err) {
        console.warn("Error processing snapshot:", err);
        continue;
      }
    }

    return latestSnapshots;
  } catch (err) {
    console.error("Failed to load snapshots:", err);
    throw err;
  }
};

// Load the latest code snapshot for the given session, language, and problem
export const updateEditorTheme = (newTheme, setTheme) => {
  loader.init().then((monaco) => {
    monaco.editor.setTheme(newTheme);
    setTheme(newTheme);
  });
};
