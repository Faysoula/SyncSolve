
/**
 * A React component that provides an AI assistant interface for code-related queries.
 * The assistant can provide suggestions and help based on code, problem description, and test cases.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.code - The current code being worked on
 * @param {Object} props.problem - The problem object containing details about the coding problem
 * @param {string} props.problem.description - The description of the coding problem
 * @param {Array} props.problem.test_cases - The test cases for the coding problem
 * 
 * @returns {JSX.Element} A chat-like interface with a message history display and input form
 * 
 * @example
 * <AiAssistant 
 *   code="function example() { }"
 *   problem={{
 *     description: "Write a function that...",
 *     test_cases: ["test1", "test2"]
 *   }}
 * />
 */
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { Brain, Send } from "lucide-react";
import OpenAIService from "../../Services/openAiService";

const AiAssistant = ({ code, problem }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message first
    setMessages((prev) => [...prev, { type: "user", content: prompt }]);
    setLoading(true);
    setError(null);

    try {
      const suggestion = await OpenAIService.getCodeSuggestion(
        prompt,
        code,
        problem.description,
        problem.test_cases
      );
      setMessages((prev) => [
        ...prev,
        { type: "assistant", content: suggestion.response },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <Stack
      sx={{
        height: "100%",
        borderLeft: "1px solid rgba(157, 78, 221, 0.2)",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(157, 78, 221, 0.2)",
          backgroundColor: "rgba(26, 22, 38, 0.6)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#FAF0CA",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
          }}
        >
          <Brain size={20} />
          Ask Dave!
        </Typography>
      </Box>

      <Box
        ref={messagesBoxRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#1A1626",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3C096C",
            borderRadius: "3px",
          },
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{
              bgcolor: "rgba(248, 113, 113, 0.1)",
              color: "#f87171",
            }}
          >
            {error}
          </Alert>
        )}
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              bgcolor:
                message.type === "user"
                  ? "rgba(157, 78, 221, 0.1)"
                  : "rgba(60, 9, 108, 0.3)",
              p: 2,
              borderRadius: 1,
              alignSelf: message.type === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
            }}
          >
            <Typography
              sx={{
                color: "#FAF0CA",
                fontFamily:
                  message.type === "assistant" ? "monospace" : "inherit",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: "1px solid rgba(157, 78, 221, 0.2)",
          backgroundColor: "rgba(26, 22, 38, 0.6)",
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for suggestions..."
            size="small"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#FAF0CA",
                bgcolor: "#240046",
                "& fieldset": { border: "none" },
                "&.Mui-disabled": {
                  opacity: 0.7,
                  bgcolor: "#1A1626",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !prompt.trim()}
            sx={{
              bgcolor: "#7B2CBF",
              color: "#FAF0CA",
              "&:hover": { bgcolor: "#9D4EDD" },
              "&.Mui-disabled": {
                bgcolor: "#3C096C",
                color: "rgba(250, 240, 202, 0.5)",
              },
              minWidth: "auto",
              px: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#FAF0CA" }} />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AiAssistant;
