import { Router, Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { validateRequest } from '../middleware/validation';
import { registerSchema, loginSchema, refreshSchema, verifyEmailSchema, resetPasswordRequestSchema, resetPasswordSchema } from '../validators/auth.validator';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(400).json({
      error: 'Registration Failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const result = await AuthService.login(email, password, ipAddress, userAgent);

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({
      error: 'Authentication Failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validateRequest(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refresh(refreshToken);

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Token Refresh Failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', validateRequest(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);

    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(400).json({
      error: 'Logout Failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email address
 */
router.post('/verify-email', validateRequest(verifyEmailSchema), async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;
    await AuthService.verifyEmail(email, token);

    res.status(200).json({
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    logger.error('Email verification error:', error);
    res.status(400).json({
      error: 'Verification Failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/request-password-reset
 * Request password reset
 */
router.post('/request-password-reset', validateRequest(resetPasswordRequestSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);

    res.status(200).json({
      message: 'If an account exists with this email, you will receive password reset instructions.',
    });
  } catch (error: any) {
    logger.error('Password reset request error:', error);
    res.status(400).json({
      error: 'Request Failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password
 */
router.post('/reset-password', validateRequest(resetPasswordSchema), async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;
    await AuthService.resetPassword(email, token, newPassword);

    res.status(200).json({
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error: any) {
    logger.error('Password reset error:', error);
    res.status(400).json({
      error: 'Reset Failed',
      message: error.message,
    });
  }
});

export default router;
