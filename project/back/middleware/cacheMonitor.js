const redisClient = require("../config/redis");

const cacheMonitor = async (req, res, next) => {
  const start = Date.now();
  const key = `cache:${req.originalUrl || req.url}`;

  try {
    const cachedResponse = await redisClient.get(key);
    const end = Date.now();

    if (cachedResponse) {
      console.log(`Cache hit for ${key} - Time: ${end - start}ms`);
    } else {
      console.log(`Cache miss for ${key} - Time: ${end - start}ms`);
    }
  } catch (error) {
    console.error("Cache monitoring error:", error);
  }

  next();
};

module.exports = cacheMonitor;
