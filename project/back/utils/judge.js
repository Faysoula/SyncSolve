const axios = require("axios");
require("dotenv").config();

const LANGUAGE_MAP = {
  Cpp: 54,
  Java: 62,
  Python: 71,
};

const CODE_TEMPLATES = {
  Cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

class Solution {
public:
    %CODE%
};

vector<int> parseInput(const string& input) {
    vector<int> nums;
    string trimmed = input;
    
    // Remove brackets
    if (!trimmed.empty() && trimmed.front() == '[') {
        trimmed = trimmed.substr(1);
    }
    if (!trimmed.empty() && trimmed.back() == ']') {
        trimmed = trimmed.substr(0, trimmed.length() - 1);
    }
    
    // Parse numbers
    stringstream ss(trimmed);
    string number;
    while (getline(ss, number, ',')) {
        // Skip any whitespace
        stringstream numberStream(number);
        int value;
        if (numberStream >> value) {
            nums.push_back(value);
        }
    }
    return nums;
}

int main() {
    string input;
    getline(cin, input);
    
    try {
        vector<int> nums = parseInput(input);
        Solution solution;
        int result = solution.solve(nums);
        cout << result << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    return 0;
}`,

  Java: `
import java.util.*;

public class Solution {
    %CODE%
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] parts = scanner.nextLine().trim().split("\\s+");
        int[] nums = new int[parts.length];
        
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        Solution solution = new Solution();
        try {
            int result = solution.solve(nums);
            System.out.println(result);
        } catch (Exception e) {
            System.err.println("Runtime error: " + e.getMessage());
            System.exit(1);
        }
    }
}`,

  Python: `
class Solution:
    %CODE%

def main():
    try:
        nums = list(map(int, input().strip().split()))
        solution = Solution()
        result = solution.solve(nums)
        print(result)
    except Exception as e:
        print(f"Runtime error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
`,
};

const checkTestCases = async (code, language, testCases) => {
  const languageId = LANGUAGE_MAP[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const fullCode = prepareCode(code, language);
  const results = [];

  for (const testCase of testCases) {
    try {
      // Ensure input is properly formatted
      const input =
        typeof testCase.input === "string"
          ? testCase.input.trim()
          : JSON.stringify(testCase.input);

      const expectedOutput = testCase.expected_output.toString().trim();

      const submission = {
        source_code: Buffer.from(fullCode).toString("base64"),
        language_id: languageId,
        stdin: Buffer.from(input).toString("base64"),
        expected_output: Buffer.from(expectedOutput).toString("base64"),
        cpu_time_limit: 2,
        memory_limit: 128000,
        base64_encoded: true,
      };

      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false",
        submission,
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const { token } = response.data;
      if (!token) {
        throw new Error("No submission token received");
      }

      // Poll for results
      let resultResponse;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        try {
          resultResponse = await axios.get(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`,
            {
              headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
            }
          );

          const { status } = resultResponse.data;

          if (status.id !== 1 && status.id !== 2) {
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;
        } catch (error) {
          console.error("Polling error:", error);
          throw new Error("Failed to retrieve execution results");
        }
      }

      if (!resultResponse) {
        throw new Error("Execution timed out");
      }

      const { stdout, stderr, status, compile_output } = resultResponse.data;

      // Decode base64 outputs
      const decodedOutput = stdout
        ? Buffer.from(stdout, "base64").toString()
        : "";
      const decodedError = stderr
        ? Buffer.from(stderr, "base64").toString()
        : "";
      const decodedCompileOutput = compile_output
        ? Buffer.from(compile_output, "base64").toString()
        : "";

      const output = decodedOutput.trim();
      const error = decodedError || decodedCompileOutput || "";

      // Check if execution was successful
      const passed = status.id === 3 && output === expectedOutput;

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        output,
        passed,
        error,
        status: status.description,
      });
    } catch (error) {
      console.error("Test case execution error:", error);
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        output: null,
        passed: false,
        error: error.message || "Execution failed",
        status: "Error",
      });
    }
  }

  return {
    allPassed: results.every((r) => r.passed),
    results: results,
  };
};

const prepareCode = (userCode, language) => {
  const template = CODE_TEMPLATES[language];
  if (!template) {
    throw new Error(`No template found for language: ${language}`);
  }
  return template.replace("%CODE%", userCode.trim());
};

module.exports = {
  checkTestCases,
  LANGUAGE_MAP,
};
