const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// Handle single image upload
router.post("/upload", auth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file path to be stored in the database
    res.json({
      path: req.file.filename,
      message: "File uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file" });
  }
});

// Serve uploaded files
router.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(filename, { root: "uploads" });
});

module.exports = router;
