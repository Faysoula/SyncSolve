// controllers/aiController.js
const openai = require("openai");
require("dotenv").config();

const client = new openai.OpenAI(process.env.OPENAI_API_KEY);

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
      temperature: 0.7,
      max_tokens: 500,
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
