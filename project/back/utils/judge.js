const axios = require("axios");
require("dotenv").config();

const LANGUAGE_MAP = {
  Cpp: 54,
  Java: 62,
  Python: 71,
};

// Helper function to detect input type from test cases
const detectInputType = (testCases) => {
  const firstInput = testCases[0].input;
  const inputStr = String(firstInput).trim();

  // Check if it's a matrix
  if (inputStr.startsWith("[[")) {
    return "matrix";
  }
  // Check if it's multiple arrays (has newline or multiple arrays)
  if (inputStr.includes("\n") && inputStr.includes("[")) {
    return "multiple_arrays";
  }
  // Check if it's a single array
  if (inputStr.startsWith("[")) {
    // Check if there's an additional integer input
    if (testCases[0].hasOwnProperty("second_input")) {
      return "array_and_integer";
    }
    return "single_array";
  }
  // Check if it's multiple integers
  if (inputStr.includes(" ")) {
    return "multiple_integers";
  }
  // Single integer is the default case
  return "single_integer";
};

// Function to generate the appropriate solve() signature
const generateSolveSignature = (inputType) => {
  switch (inputType) {
    case "matrix":
      return "int solve(vector<vector<int>>& matrix)";
    case "multiple_arrays":
      return "int solve(vector<int>& nums1, vector<int>& nums2)";
    case "single_array":
      return "int solve(vector<int>& nums)";
    case "array_and_integer":
      return "int solve(vector<int>& nums, int target)";
    case "multiple_integers":
      return "int solve(int a, int b)";
    case "single_integer":
    default:
      return "int solve(int num)";
  }
};

const getInputParsingCode = (inputType) => {
  switch (inputType) {
    case "matrix":
      return `
vector<vector<int>> parseMatrix(const string& input) {
    vector<vector<int>> matrix;
    string s = input;
    s.erase(remove(s.begin(), s.end(), ' '), s.end());
    s = s.substr(1, s.length() - 2);
    
    vector<int> row;
    bool inNumber = false;
    string num = "";
    
    for (char c : s) {
        if (c == '[') {
            row.clear();
        } else if (c == ']') {
            if (!num.empty()) {
                row.push_back(stoi(num));
                num = "";
            }
            if (!row.empty()) {
                matrix.push_back(row);
            }
        } else if (c == ',') {
            if (!num.empty()) {
                row.push_back(stoi(num));
                num = "";
            }
        } else if (isdigit(c) || c == '-') {
            num += c;
        }
    }
    return matrix;
}`;

    case "single_array":
    case "multiple_arrays":
      return `
vector<int> parseArray(const string& input) {
    vector<int> nums;
    string s = input;
    s.erase(remove(s.begin(), s.end(), ' '), s.end());
    if (s.front() == '[') s = s.substr(1);
    if (s.back() == ']') s.pop_back();
    
    stringstream ss(s);
    string item;
    while (getline(ss, item, ',')) {
        if (!item.empty()) {
            nums.push_back(stoi(item));
        }
    }
    return nums;
}`;

    default:
      return "";
  }
};

const generateMainFunction = (inputType) => {
  switch (inputType) {
    case "matrix":
      return `
int main() {
    string input;
    getline(cin, input);
    auto matrix = parseMatrix(input);
    
    Solution solution;
    cout << solution.solve(matrix) << endl;
    return 0;
}`;

    case "multiple_arrays":
      return `
int main() {
    string input1, input2;
    getline(cin, input1);
    getline(cin, input2);
    auto nums1 = parseArray(input1);
    auto nums2 = parseArray(input2);
    
    Solution solution;
    cout << solution.solve(nums1, nums2) << endl;
    return 0;
}`;

    case "single_array":
      return `
int main() {
    string input;
    getline(cin, input);
    auto nums = parseArray(input);
    
    Solution solution;
    cout << solution.solve(nums) << endl;
    return 0;
}`;

    case "array_and_integer":
      return `
int main() {
    string array_input;
    getline(cin, array_input);
    auto nums = parseArray(array_input);
    
    int target;
    cin >> target;
    
    Solution solution;
    cout << solution.solve(nums, target) << endl;
    return 0;
}`;

    case "multiple_integers":
      return `
int main() {
    int a, b;
    cin >> a >> b;
    
    Solution solution;
    cout << solution.solve(a, b) << endl;
    return 0;
}`;

    case "single_integer":
    default:
      return `
int main() {
    int num;
    cin >> num;
    
    Solution solution;
    cout << solution.solve(num) << endl;
    return 0;
}`;
  }
};

const generateFullTemplate = (userCode, inputType) => {
  const headers =
    "#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\n";
  const inputParser = getInputParsingCode(inputType);
  const mainFunction = generateMainFunction(inputType);

  return `${headers}class Solution {\npublic:\n    ${userCode}\n};\n\n${inputParser}\n${mainFunction}`;
};

const checkTestCases = async (userCode, language, testCases) => {
  const inputType = detectInputType(testCases);
  const fullCode = generateFullTemplate(userCode, inputType);
  const languageId = LANGUAGE_MAP[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

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

module.exports = {
  checkTestCases,
  LANGUAGE_MAP,
  // Export for testing purposes
  detectInputType,
  generateSolveSignature,
};
