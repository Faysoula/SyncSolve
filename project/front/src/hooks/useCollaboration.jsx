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