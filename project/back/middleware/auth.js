const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header found" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = auth;
