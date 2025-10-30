import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis;

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redisClient.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    // Test connection
    await redisClient.ping();
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

/**
 * Get Redis client
 */
export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

/**
 * Store refresh token in Redis
 */
export const storeRefreshToken = async (
  userId: string,
  token: string,
  expiresIn: number
): Promise<void> => {
  const key = `refresh_token:${userId}`;
  await redisClient.setex(key, expiresIn, token);
};

/**
 * Get refresh token from Redis
 */
export const getRefreshToken = async (userId: string): Promise<string | null> => {
  const key = `refresh_token:${userId}`;
  return await redisClient.get(key);
};

/**
 * Delete refresh token from Redis
 */
export const deleteRefreshToken = async (userId: string): Promise<void> => {
  const key = `refresh_token:${userId}`;
  await redisClient.del(key);
};

/**
 * Store email verification token
 */
export const storeVerificationToken = async (
  email: string,
  token: string,
  expiresIn: number = 3600
): Promise<void> => {
  const key = `verify_email:${email}`;
  await redisClient.setex(key, expiresIn, token);
};

/**
 * Get verification token
 */
export const getVerificationToken = async (email: string): Promise<string | null> => {
  const key = `verify_email:${email}`;
  return await redisClient.get(key);
};

/**
 * Delete verification token
 */
export const deleteVerificationToken = async (email: string): Promise<void> => {
  const key = `verify_email:${email}`;
  await redisClient.del(key);
};

/**
 * Store password reset token
 */
export const storePasswordResetToken = async (
  email: string,
  token: string,
  expiresIn: number = 3600
): Promise<void> => {
  const key = `reset_password:${email}`;
  await redisClient.setex(key, expiresIn, token);
};

/**
 * Get password reset token
 */
export const getPasswordResetToken = async (email: string): Promise<string | null> => {
  const key = `reset_password:${email}`;
  return await redisClient.get(key);
};

/**
 * Delete password reset token
 */
export const deletePasswordResetToken = async (email: string): Promise<void> => {
  const key = `reset_password:${email}`;
  await redisClient.del(key);
};

/**
 * Close Redis connection
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
};
