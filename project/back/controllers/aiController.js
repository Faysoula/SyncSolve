const openai = require("openai");
require("dotenv").config();

// Initialize OpenAI client with API key from environment variables
const client = new openai.OpenAI(process.env.OPENAI_API_KEY);

/**
 * Generates a formatted prompt for the AI model combining user input and problem context
 *
 * @param {string} userPrompt - The user's specific question or request
 * @param {string} code - The current code implementation
 * @param {string} problemDescription - The full problem description
 * @param {Array<Object>} testCases - Array of test cases for the problem
 * @returns {string} A formatted prompt string for the AI model
 *
 * @example
 * const prompt = generatePrompt(
 *   "How can I improve the time complexity?",
 *   "function solve(nums) { ... }",
 *   "Find maximum subarray sum",
 *   [{input: [1,2,3], expected: 6}]
 * );
 */
const generatePrompt = (userPrompt, code, problemDescription, testCases) => {
  return `As an AI coding assistant, help me with this programming problem:

Problem Description:
${problemDescription}

Test Cases:
${JSON.stringify(testCases, null, 2)}

Current Code:
${code}

User Question:
${userPrompt}

Please provide a SHORT hint or suggestion that guides the user without giving away the complete solution.`;
};

/**
 * Controller function to handle code suggestion requests
 * Processes the request, interacts with OpenAI API, and returns AI-generated suggestions
 *
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing prompt and context
 * @param {string} req.body.prompt - User's question or request
 * @param {string} req.body.code - Current code implementation
 * @param {string} req.body.problemDescription - Problem description
 * @param {Array<Object>} req.body.testCases - Problem test cases
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with AI suggestion or error
 *
 * @throws {Error} When OpenAI API call fails
 *
 * @example
 * // API endpoint: POST /api/ai/suggestion
 * // Request body:
 * {
 *   "prompt": "How can I optimize this loop?",
 *   "code": "function example() { ... }",
 *   "problemDescription": "Find duplicate numbers",
 *   "testCases": [{"input": [1,2,2], "expected": 2}]
 * }
 *
 * // Success response:
 * {
 *   "response": "Consider using a hash set to track seen numbers..."
 * }
 *
 * // Error response:
 * {
 *   "message": "Failed to generate suggestion"
 * }
 */
const getCodeSuggestion = async (req, res) => {
  const { prompt, code, problemDescription, testCases } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: generatePrompt(prompt, code, problemDescription, testCases),
        },
      ],
      temperature: 0.7, // Controls randomness in responses (0.0-1.0)
      max_tokens: 500, // Limits response length
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ message: "Failed to generate suggestion" });
  }
};

module.exports = {
  getCodeSuggestion,
};
