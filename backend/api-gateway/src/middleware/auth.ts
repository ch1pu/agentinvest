import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        subscriptionTier: string;
      };
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
  subscriptionTier: string;
  iat?: number;
  exp?: number;
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided or invalid format',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined in environment variables');
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication configuration error',
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Attach user information to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      subscriptionTier: decoded.subscriptionTier,
    };

    logger.debug(`User ${decoded.email} authenticated successfully`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
      return;
    }

    logger.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't block request if no token
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      next();
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      subscriptionTier: decoded.subscriptionTier,
    };

    next();
  } catch (error) {
    // Token invalid, but continue without user
    next();
  }
};
