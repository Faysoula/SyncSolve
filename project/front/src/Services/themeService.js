// services/themeService.js
import { loader } from "@monaco-editor/react";
import { importThemes } from "../utils/editorThemes";

export const defineThemes = async () => {
  try {
    const monaco = await loader.init();
    const themes = await importThemes();

    // Register each theme with Monaco
    Object.entries(themes).forEach(([themeName, themeData]) => {
      monaco.editor.defineTheme(themeName, themeData);
    });
    return monaco;
  } catch (error) {
    console.error("Error defining themes:", error);
    throw error;
  }
};

export const setEditorTheme = async (newTheme, editor) => {
  try {
    const monaco = await loader.init();

    // If it's a custom theme, ensure themes are defined
    if (!["vs", "vs-dark", "hc-black"].includes(newTheme)) {
      await defineThemes();
    }

    if (editor) {
      editor.updateOptions({ theme: newTheme });
    }
    monaco.editor.setTheme(newTheme);
    return true;
  } catch (error) {
    console.error("Error setting theme:", error);
    return false;
  }
};
