import http from "../http-common";
import { getTokenBearer } from "../utils/token";

const getCodeSuggestion = async (
  prompt,
  code,
  problemDescription,
  testCases
) => {
  try {
    const response = await http.post(
      "/ai/suggestion",
      {
        prompt,
        code,
        problemDescription,
        testCases,
      },
      {
        headers: {
          Authorization: getTokenBearer(),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get AI suggestion"
    );
  }
};

const OpenAIService = {
  getCodeSuggestion,
};

export default OpenAIService;
