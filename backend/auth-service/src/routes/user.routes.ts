import { Router, Request, Response } from 'express';
import * as UserModel from '../models/user.model';
import * as SessionModel from '../models/session.model';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { updateUserSchema } from '../validators/user.validator';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await UserModel.findUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({ user: userWithoutPassword });
  } catch (error: any) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * PUT /api/users/me
 * Update current user profile
 */
router.put('/me', authMiddleware, validateRequest(updateUserSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const updatedUser = await UserModel.updateUser(userId, req.body);
    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: 'User updated successfully',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    logger.error('Update user error:', error);
    res.status(400).json({
      error: 'Update Failed',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/users/me
 * Delete current user account
 */
router.delete('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Delete all sessions
    await SessionModel.deleteUserSessions(userId);

    // Soft delete user
    await UserModel.deleteUser(userId);

    res.status(200).json({
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/users/me/sessions
 * Get all active sessions for current user
 */
router.get('/me/sessions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sessions = await SessionModel.findUserSessions(userId);

    // Hide refresh tokens in response
    const sanitizedSessions = sessions.map(session => ({
      id: session.id,
      device_info: session.device_info,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      created_at: session.created_at,
      expires_at: session.expires_at,
    }));

    res.status(200).json({ sessions: sanitizedSessions });
  } catch (error: any) {
    logger.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /api/users/me/sessions/:sessionId
 * Revoke a specific session
 */
router.delete('/me/sessions/:sessionId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.sessionId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await SessionModel.deleteSessionById(sessionId);

    res.status(200).json({
      message: 'Session revoked successfully',
    });
  } catch (error: any) {
    logger.error('Revoke session error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
