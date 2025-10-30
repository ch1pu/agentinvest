import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { connectDatabase } from './database/connection';
import { connectRedis } from './database/redis';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware Configuration
// ============================================

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// ============================================
// Routes
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ============================================
// Error Handling
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use(errorHandler);

// ============================================
// Database Connection & Server Startup
// ============================================

const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDatabase();
    logger.info('✅ PostgreSQL connected');

    // Connect to Redis
    await connectRedis();
    logger.info('✅ Redis connected');

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Auth Service running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received: closing server');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received: closing server');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
