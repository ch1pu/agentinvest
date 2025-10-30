import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as UserModel from '../models/user.model';
import * as SessionModel from '../models/session.model';
import * as RedisService from '../database/redis';
import { logger } from '../utils/logger';

export interface LoginResult {
  user: Omit<UserModel.User, 'password_hash'>;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (user: UserModel.User): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  const payload = {
    userId: user.id,
    email: user.email,
    subscriptionTier: user.subscription_tier,
  };

  // @ts-ignore - Type incompatibility between jsonwebtoken@9.0.2 and @types/jsonwebtoken@9.0.10
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (user: UserModel.User): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  const payload = {
    userId: user.id,
    email: user.email,
    tokenId: uuidv4(),
  };

  // @ts-ignore - Type incompatibility between jsonwebtoken@9.0.2 and @types/jsonwebtoken@9.0.10
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): any => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.verify(token, secret);
};

/**
 * Register a new user
 */
export const register = async (input: RegisterInput): Promise<LoginResult> => {
  // Check if user already exists
  const existingUser = await UserModel.findUserByEmail(input.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create user
  const user = await UserModel.createUser(input);

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in Redis
  const refreshExpiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
  await RedisService.storeRefreshToken(user.id, refreshToken, refreshExpiresIn);

  // Create session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await SessionModel.createSession({
    user_id: user.id,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  });

  // Generate email verification token
  const verificationToken = uuidv4();
  await UserModel.setEmailVerificationToken(user.id, verificationToken);
  await RedisService.storeVerificationToken(user.email, verificationToken, 3600);

  // TODO: Send verification email
  logger.info(`Verification token for ${user.email}: ${verificationToken}`);

  // Remove password hash from response
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<LoginResult> => {
  // Find user
  const user = await UserModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await UserModel.updateLastLogin(user.id);

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in Redis
  const refreshExpiresIn = 30 * 24 * 60 * 60; // 30 days
  await RedisService.storeRefreshToken(user.id, refreshToken, refreshExpiresIn);

  // Create session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await SessionModel.createSession({
    user_id: user.id,
    refresh_token: refreshToken,
    ip_address: ipAddress,
    user_agent: userAgent,
    expires_at: expiresAt,
  });

  // Remove password hash from response
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
 */
export const refresh = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if token exists in Redis
  const storedToken = await RedisService.getRefreshToken(decoded.userId);
  if (!storedToken || storedToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  // Get user
  const user = await UserModel.findUserById(decoded.userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Delete old session and create new one
  await SessionModel.deleteSession(refreshToken);
  await RedisService.deleteRefreshToken(user.id);

  // Store new refresh token
  const refreshExpiresIn = 30 * 24 * 60 * 60;
  await RedisService.storeRefreshToken(user.id, newRefreshToken, refreshExpiresIn);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await SessionModel.createSession({
    user_id: user.id,
    refresh_token: newRefreshToken,
    expires_at: expiresAt,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Logout user
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const decoded = verifyRefreshToken(refreshToken);
  await SessionModel.deleteSession(refreshToken);
  await RedisService.deleteRefreshToken(decoded.userId);
};

/**
 * Verify email
 */
export const verifyEmail = async (email: string, token: string): Promise<void> => {
  const storedToken = await RedisService.getVerificationToken(email);
  if (!storedToken || storedToken !== token) {
    throw new Error('Invalid or expired verification token');
  }

  await UserModel.verifyEmail(email);
  await RedisService.deleteVerificationToken(email);
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await UserModel.findUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists
    return;
  }

  const resetToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

  await UserModel.setPasswordResetToken(email, resetToken, expiresAt);
  await RedisService.storePasswordResetToken(email, resetToken, 3600);

  // TODO: Send password reset email
  logger.info(`Password reset token for ${email}: ${resetToken}`);
};

/**
 * Reset password
 */
export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<void> => {
  const storedToken = await RedisService.getPasswordResetToken(email);
  if (!storedToken || storedToken !== token) {
    throw new Error('Invalid or expired reset token');
  }

  await UserModel.resetPassword(email, newPassword);
  await RedisService.deletePasswordResetToken(email);

  // Delete all sessions for this user
  const user = await UserModel.findUserByEmail(email);
  if (user) {
    await SessionModel.deleteUserSessions(user.id);
    await RedisService.deleteRefreshToken(user.id);
  }
};
