const axios = require("axios");
require("dotenv").config();

const LANGUAGE_MAP = {
  Cpp: 54,
  Java: 62,
  Python: 71,
};

const checkTestCases = async (code, language, testCases) => {
  const languageId = LANGUAGE_MAP[language];
  if (!languageId) {
    throw new Error("Unsupported language for syntax check");
  }

  const results = [];

  for (const testCase of testCases) {
    const { input, expected_output } = testCase;
    try {
      // Submit the code with test case input
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageId,
          stdin: input, // Pass the test case input here
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
        if (status.id !== 1 && status.id !== 2) break; // Status 1 and 2 mean "In Queue" and "Processing"
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }

      // Retrieve result and compare with expected output
      const { stdout, stderr, compile_output, status } = resultResponse.data;
      const output = stdout || stderr || compile_output || "";
      const passed = output.trim() === expected_output.trim();

      results.push({ testCase, output, passed });
    } catch (error) {
      results.push({ testCase, error: error.message, passed: false });
    }
  }

  // Determine overall success
  const allPassed = results.every((result) => result.passed);
  return { allPassed, results };
};

module.exports = checkTestCases;
