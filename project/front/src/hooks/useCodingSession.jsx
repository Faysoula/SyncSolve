import { useState, useEffect } from "react";
import SessionTerminalService from "../Services/sessionService";
import ProblemService from "../Services/problemService";

export const useCodingSession = (problemId, user, language) => {
  const [sessionData, setSessionData] = useState({
    sessionId: null,
    terminalId: null,
  });
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session and create terminal
  const initializeSession = async () => {
    try {
      if (!user?.user_id || !problemId) {
        throw new Error("Missing required user_id or problem_id");
      }

      console.log("Initializing session with:", {
        userId: user.user_id,
        problemId: problemId,
        language: language,
      });

      // Create a new session
      const session = await SessionTerminalService.createProblemSession(
        user.user_id,
        problemId
      );

      console.log("Session created:", session);

      if (!session?.session_id) {
        throw new Error("Invalid session response");
      }

      // Create a terminal for the session
      const terminal = await SessionTerminalService.createTerminal(
        session.session_id,
        language
      );

      console.log("Terminal created:", terminal);

      setSessionData({
        sessionId: session.session_id,
        terminalId: terminal.terminal_id,
      });

      return { session, terminal };
    } catch (err) {
      console.error("Full initialization error:", err);
      setError(
        err.message || "Failed to initialize coding session. Please try again."
      );
      return null;
    }
  };

  // Load problem and initialize session
  useEffect(() => {
    const loadProblemAndSession = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load problem details
        const problemRes = await ProblemService.getProblemById(problemId);
        setProblem(problemRes.data);

        // Initialize session and terminal
        if (user) {
          await initializeSession();
        }
      } catch (err) {
        console.error("Error in initialization:", err);
        setError(err.response?.data?.message || "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    if (problemId && user) {
      loadProblemAndSession();
    }

    return () => {
      // Could add cleanup logic here
      // Like ending the session when component unmounts
      // la n3ish
    };
  }, [problemId, user]);

  // Handle language changes
  useEffect(() => {
    const updateTerminal = async () => {
      if (sessionData.sessionId) {
        try {
          const terminal = await SessionTerminalService.createTerminal(
            sessionData.sessionId,
            language
          );
          setSessionData((prev) => ({
            ...prev,
            terminalId: terminal.terminal_id,
          }));
        } catch (err) {
          console.error("Failed to update terminal:", err);
          setError(
            "Failed to update coding environment. Please refresh the page."
          );
        }
      }
    };

    if (sessionData.sessionId) {
      updateTerminal();
    }
  }, [language]);

  return {
    sessionData,
    problem,
    loading,
    error,
    setError,
  };
};
