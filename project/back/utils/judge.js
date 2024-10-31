const axios = require("axios");
require("dotenv").config();

const LANGUAGE_MAP = {
  Cpp: 54, // C++ (GCC 9.2.0)
  Java: 62, // Java (OpenJDK 13.0.1)
  Python: 71, // Python (3.8.1)
};

const checkSyntax = async (code, language) => {
  const languageId = LANGUAGE_MAP[language];
  console.log(
    "Checking syntax for language:",
    language,
    "with ID:",
    languageId
  );

  if (!languageId) {
    throw new Error("Unsupported language for syntax check");
  }

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: languageId,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const { token } = response.data;
    console.log("Submission token:", token);

    const maxWaitTime = 30000;
    const pollingInterval = 3000;
    const startTime = Date.now();

    let resultResponse;
    while (true) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > maxWaitTime) {
        throw new Error("Execution timed out. Please try again later.");
      }

      resultResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const { status } = resultResponse.data;
      console.log("Judge0 Status:", status.description);

      if (status.id !== 1 && status.id !== 2) break;
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }

    const { stderr, stdout, compile_output, status } = resultResponse.data;
    if (status.id === 3) {
      return { valid: true, result: stdout, status: "success" };
    } else {
      return {
        valid: false,
        result: stderr || compile_output || "Syntax error",
        status: "error",
      };
    }
  } catch (error) {
    throw new Error(`Syntax check failed: ${error.message}`);
  }
};

module.exports = checkSyntax;
