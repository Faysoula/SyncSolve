/**
 * A custom hook that handles real-time collaboration features in a code editor.
 *
 * @param {Object} params - The parameters object
 * @param {string} params.sessionId - The unique identifier for the collaboration session
 * @param {string} params.problemId - The unique identifier for the problem being solved
 * @param {Object} params.user - The current user object
 * @param {string} params.user.user_id - The unique identifier for the current user
 * @param {string} params.language - The programming language being used
 * @param {Function} params.setCodeStates - State setter function for code content
 * @param {Function} params.setCollaborators - State setter function for collaborators' information
 * @param {Object} params.editorRef - Reference to the Monaco editor instance
 * @param {Object} params.isLocalChange - Reference to track if changes are local
 *
 * @returns {void}
 *
 * @description
 * This hook manages socket connections for real-time collaboration features including:
 * - Connecting to a collaboration session
 * - Synchronizing code changes between collaborators
 * - Tracking and updating cursor positions
 * - Maintaining editor state during collaborative editing
 *
 * The hook automatically handles cleanup by disconnecting the socket when the component unmounts
 * or when key dependencies change.
 */
import { useEffect } from "react";
import socketService from "../Services/socketService";

export const useCollaboration = ({
  sessionId,
  problemId,
  user,
  language,
  setCodeStates,
  setCollaborators,
  editorRef,
  isLocalChange,
}) => {
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

              const currentPosition = editor.getPosition();
              const currentSelection = editor.getSelection();

              setCodeStates((prev) => ({
                ...prev,
                [codeLang]: code,
              }));

              setCollaborators((prev) => {
                const newMap = new Map(prev);
                const collaborator = newMap.get(userId) || {};
                newMap.set(userId, {
                  ...collaborator,
                  cursor: cursorPosition || collaborator.cursor,
                });
                return newMap;
              });

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
};
