import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

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
}

/**
 * Authentication middleware
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      logger.error('JWT_SECRET not configured');
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication configuration error',
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      subscriptionTier: decoded.subscriptionTier,
    };

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
    });
  }
};
