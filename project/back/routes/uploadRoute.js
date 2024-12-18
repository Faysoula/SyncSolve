const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 * 
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
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
/**
 * @swagger
 * /api/uploads/{filename}:
 *   get:
 *     summary: Get an uploaded file
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File retrieved successfully
 */
router.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(filename, { root: "uploads" });
});

module.exports = router;
