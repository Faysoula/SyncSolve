const redisClient = require("../config/redis");

const CacheService = {
  // Clear all cache
  clearAll: async () => {
    try {
      await redisClient.flushAll();
      console.log("Cache cleared successfully");
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  },

  // Clear specific pattern
  clearPattern: async (pattern) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Cleared ${keys.length} keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error("Error clearing cache pattern:", error);
      throw error;
    }
  },

  // Clear problems cache
  clearProblemsCache: async () => {
    await CacheService.clearPattern("cache:/api/problems*");
  },

  // Clear specific problem cache
  clearProblemCache: async (problemId) => {
    await CacheService.clearPattern(`cache:/api/problems/${problemId}`);
  },

  // Clear daily problem cache
  clearDailyProblemCache: async () => {
    await CacheService.clearPattern("cache:/api/problems/daily");
  },
};

module.exports = CacheService;
