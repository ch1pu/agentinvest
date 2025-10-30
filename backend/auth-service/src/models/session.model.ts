import { query } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  device_info?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
  created_at: Date;
}

export interface CreateSessionInput {
  user_id: string;
  refresh_token: string;
  device_info?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
}

/**
 * Create a new session
 */
export const createSession = async (input: CreateSessionInput): Promise<Session> => {
  const sessionId = uuidv4();

  const result = await query(
    `INSERT INTO sessions (id, user_id, refresh_token, device_info, ip_address, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      sessionId,
      input.user_id,
      input.refresh_token,
      input.device_info ? JSON.stringify(input.device_info) : null,
      input.ip_address,
      input.user_agent,
      input.expires_at,
    ]
  );

  return result.rows[0];
};

/**
 * Find session by refresh token
 */
export const findSessionByToken = async (token: string): Promise<Session | null> => {
  const result = await query(
    'SELECT * FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()',
    [token]
  );

  return result.rows[0] || null;
};

/**
 * Find all sessions for a user
 */
export const findUserSessions = async (userId: string): Promise<Session[]> => {
  const result = await query(
    'SELECT * FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC',
    [userId]
  );

  return result.rows;
};

/**
 * Delete session by refresh token
 */
export const deleteSession = async (token: string): Promise<void> => {
  await query('DELETE FROM sessions WHERE refresh_token = $1', [token]);
};

/**
 * Delete all sessions for a user
 */
export const deleteUserSessions = async (userId: string): Promise<void> => {
  await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
};

/**
 * Delete expired sessions
 */
export const deleteExpiredSessions = async (): Promise<void> => {
  await query('DELETE FROM sessions WHERE expires_at <= NOW()');
};

/**
 * Delete session by ID
 */
export const deleteSessionById = async (sessionId: string): Promise<void> => {
  await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
};
