const redisClient = require("../config/redis");

const cache = (duration) => {
  return async (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    console.log("Checking cache for key:", key); // Log the cache key being checked

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        console.log("🚀 Cache HIT"); // Visual indicator for cache hit
        return res.json(JSON.parse(cachedResponse));
      }

      console.log("❌ Cache MISS"); // Visual indicator for cache miss
      const originalSend = res.json;

      res.json = function (body) {
        console.log("💾 Storing in cache for", duration, "seconds"); // Log cache storage
        redisClient
          .setEx(key, duration, JSON.stringify(body))
          .catch((err) => console.error("Redis set error:", err));
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

module.exports = cache;