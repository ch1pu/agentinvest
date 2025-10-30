import { query } from '../database/connection';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  last_login?: Date;
  subscription_tier: string;
  subscription_expires?: Date;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}

/**
 * Create a new user
 */
export const createUser = async (input: CreateUserInput): Promise<User> => {
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
  const passwordHash = await bcrypt.hash(input.password, bcryptRounds);
  const userId = uuidv4();

  const result = await query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, email_verified, subscription_tier)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, input.email, passwordHash, input.first_name, input.last_name, input.phone, false, 'free']
  );

  return result.rows[0];
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );

  return result.rows[0] || null;
};

/**
 * Find user by ID
 */
export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );

  return result.rows[0] || null;
};

/**
 * Verify password
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Update user
 */
export const updateUser = async (id: string, input: UpdateUserInput): Promise<User> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (input.first_name !== undefined) {
    fields.push(`first_name = $${paramCount++}`);
    values.push(input.first_name);
  }
  if (input.last_name !== undefined) {
    fields.push(`last_name = $${paramCount++}`);
    values.push(input.last_name);
  }
  if (input.phone !== undefined) {
    fields.push(`phone = $${paramCount++}`);
    values.push(input.phone);
  }
  if (input.avatar_url !== undefined) {
    fields.push(`avatar_url = $${paramCount++}`);
    values.push(input.avatar_url);
  }
  if (input.preferences !== undefined) {
    fields.push(`preferences = $${paramCount++}`);
    values.push(JSON.stringify(input.preferences));
  }

  values.push(id);

  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  return result.rows[0];
};

/**
 * Update last login
 */
export const updateLastLogin = async (id: string): Promise<void> => {
  await query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );
};

/**
 * Set email verification token
 */
export const setEmailVerificationToken = async (id: string, token: string): Promise<void> => {
  await query(
    'UPDATE users SET email_verification_token = $1 WHERE id = $2',
    [token, id]
  );
};

/**
 * Verify email
 */
export const verifyEmail = async (email: string): Promise<void> => {
  await query(
    'UPDATE users SET email_verified = TRUE, email_verification_token = NULL WHERE email = $1',
    [email]
  );
};

/**
 * Set password reset token
 */
export const setPasswordResetToken = async (
  email: string,
  token: string,
  expiresAt: Date
): Promise<void> => {
  await query(
    'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3',
    [token, expiresAt, email]
  );
};

/**
 * Reset password
 */
export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
  const passwordHash = await bcrypt.hash(newPassword, bcryptRounds);

  await query(
    `UPDATE users
     SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL
     WHERE email = $2`,
    [passwordHash, email]
  );
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await query(
    'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );
};

/**
 * Update subscription
 */
export const updateSubscription = async (
  id: string,
  tier: string,
  expiresAt?: Date
): Promise<void> => {
  await query(
    'UPDATE users SET subscription_tier = $1, subscription_expires = $2 WHERE id = $3',
    [tier, expiresAt, id]
  );
};
