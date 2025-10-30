import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

/**
 * PostgreSQL connection pool configuration
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'agentinvest',
      user: process.env.POSTGRES_USER || 'agentinvest',
      password: process.env.POSTGRES_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('PostgreSQL connection pool created');
  } catch (error) {
    logger.error('PostgreSQL connection error:', error);
    throw error;
  }
};

/**
 * Get database connection pool
 */
export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDatabase() first.');
  }
  return pool;
};

/**
 * Execute a query
 */
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Query error:', { text, error });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 */
export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

/**
 * Close database connection pool
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    logger.info('PostgreSQL connection pool closed');
  }
};
