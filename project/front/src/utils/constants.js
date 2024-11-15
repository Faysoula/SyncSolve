import { alpha } from "@mui/material";

// Color configurations for different difficulty levels
export const difficultyConfig = {
  easy: {
    color: "#4ade80", // Green
    background: alpha("#4ade80", 0.1),
    label: "Easy",
  },
  medium: {
    color: "#fbbf24", // Yellow
    background: alpha("#fbbf24", 0.1),
    label: "Medium",
  },
  hard: {
    color: "#f87171", // Red
    background: alpha("#f87171", 0.1),
    label: "Hard",
  },
};

// Theme colors
export const themeColors = {
  primary: {
    main: "#3C096C",
    dark: "#240046",
    light: "#5A189A",
  },
  secondary: {
    main: "#9D4EDD",
    dark: "#7B2CBF",
    light: "#C77DFF",
  },
  text: {
    primary: "#FAF0CA",
    secondary: "rgba(250, 240, 202, 0.8)",
  },
  background: {
    default: "#0a0118",
    paper: "#3C096C",
  },
};

// API endpoints
export const API_ENDPOINTS = {
  problems: "/api/problems",
  users: "/api/users",
  auth: "/api/auth",
};

// Pagination settings
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};

// Form validation rules
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 50,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message:
      "Username can only contain letters, numbers, underscores, and hyphens",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
};

// Route paths
export const ROUTES = {
  home: "/",
  problems: "/problems",
  signin: "/signin",
  register: "/register",
  profile: "/profile",
  settings: "/settings",
};

// Local storage keys
export const STORAGE_KEYS = {
  token: "auth_token",
  user: "user_data",
  theme: "user_theme",
};

export const LANGUAGE_MAPPING = {
  cpp: "Cpp",
  python: "Python",
  java: "Java",
};
export const AVAILABLE_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Database",
  "Binary Search",
  "Matrix",
  "Tree",
  "Breadth-First Search",
  "Bit Manipulation",
  "Two Pointers",
  "Heap (Priority Queue)",
  "Binary Tree",
  "Prefix Sum",
  "Simulation",
  "Stack",
  "Counting",
  "Graph",
  "Sliding Window",
  "Design",
  "Backtracking",
  "Enumeration",
  "Union Find",
  "Linked List",
  "Ordered Set",
  "Number Theory",
  "Monotonic Stack",
  "Trie",
  "Segment Tree",
  "Bitmask",
  "Divide and Conquer",
  "Queue",
  "Recursion",
  "Combinatorics",
  "Binary Search Tree",
  "Hash Function",
  "Binary Indexed Tree",
  "Geometry",
  "Memoization",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Shortest Path",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Randomized",
  "Merge Sort",
  "Doubly-Linked List",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Bucket Sort",
  "Minimum Spanning Tree",
  "Shell",
  "Line Sweep",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
].sort();

export const STARTING_CODE_TEMPLATES = {
  python: `def solution():
    # Write your solution here
    pass`,

  cpp: `#include <vector>
#include <string>
#include <iostream>
using namespace std;

class Solution {
public:
    void solve() {
        // Write your solution here
        cout << "Hello World!" << endl;
    }
};

int main() {
    Solution solution;
    solution.solve();
    return 0;
}`,

  java: `public class Solution {
    public void solve() {
        // Write your solution here
        System.out.println("Hello World!");
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        solution.solve();
    }
}`,
};


