import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// ============================================
// Middleware Configuration
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing - DISABLED for proxy routes
// Note: Proxy middleware handles body forwarding automatically
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(`/api/${API_VERSION}`, limiter);

// ============================================
// Health Check Endpoints
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway',
    version: API_VERSION,
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      market: process.env.MARKET_SERVICE_URL,
      portfolio: process.env.PORTFOLIO_SERVICE_URL,
      ai: process.env.AI_SERVICE_URL,
      trading: process.env.TRADING_SERVICE_URL,
    },
  });
});

// ============================================
// Service Proxies
// ============================================

// Authentication Service (Public routes)
app.use(
  `/api/${API_VERSION}/auth`,
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${API_VERSION}/auth`]: '/api/auth',
    },
    onError: (err, req, res) => {
      logger.error('Auth service proxy error:', err);
      res.status(503).json({
        error: 'Authentication service unavailable',
        message: err.message,
      });
    },
  })
);

// Market Data Service (Public routes for basic data)
app.use(
  `/api/${API_VERSION}/market`,
  createProxyMiddleware({
    target: process.env.MARKET_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${API_VERSION}/market`]: '/api/market',
    },
    onError: (err, req, res) => {
      logger.error('Market service proxy error:', err);
      res.status(503).json({
        error: 'Market data service unavailable',
        message: err.message,
      });
    },
  })
);

// Portfolio Service (Protected routes)
app.use(
  `/api/${API_VERSION}/portfolio`,
  authMiddleware,
  createProxyMiddleware({
    target: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${API_VERSION}/portfolio`]: '/api/portfolio',
    },
    onProxyReq: (proxyReq, req: any) => {
      // Forward user information to the service
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId);
        proxyReq.setHeader('X-User-Email', req.user.email);
      }
    },
    onError: (err, req, res) => {
      logger.error('Portfolio service proxy error:', err);
      res.status(503).json({
        error: 'Portfolio service unavailable',
        message: err.message,
      });
    },
  })
);

// AI/ML Service (Protected routes)
app.use(
  `/api/${API_VERSION}/ai`,
  authMiddleware,
  createProxyMiddleware({
    target: process.env.AI_SERVICE_URL || 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${API_VERSION}/ai`]: '/api/ai',
    },
    onProxyReq: (proxyReq, req: any) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId);
      }
    },
    onError: (err, req, res) => {
      logger.error('AI service proxy error:', err);
      res.status(503).json({
        error: 'AI service unavailable',
        message: err.message,
      });
    },
  })
);

// Trading Service (Protected routes)
app.use(
  `/api/${API_VERSION}/trading`,
  authMiddleware,
  createProxyMiddleware({
    target: process.env.TRADING_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${API_VERSION}/trading`]: '/api/trading',
    },
    onProxyReq: (proxyReq, req: any) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId);
      }
    },
    onError: (err, req, res) => {
      logger.error('Trading service proxy error:', err);
      res.status(503).json({
        error: 'Trading service unavailable',
        message: err.message,
      });
    },
  })
);

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const server = app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 API Version: ${API_VERSION}`);
  logger.info(`🌐 CORS Origins: ${corsOptions.origin.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
