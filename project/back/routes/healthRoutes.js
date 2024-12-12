const express = require("express");
const router = express.Router();
const redisClient = require("../config/redis");

router.get("/health/cache", async (req, res) => {
  try {
    await redisClient.ping();
    res.json({ status: "healthy", message: "Cache is operational" });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      message: "Cache is not operational",
      error: error.message,
    });
  }
});

module.exports = router;
