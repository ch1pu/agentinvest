-- AgentInvest TimescaleDB Initialization Script
-- This script creates time-series tables and hypertables

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ============================================
-- Stock Prices (Daily) - Hypertable
-- ============================================

CREATE TABLE IF NOT EXISTS stock_prices (
  time TIMESTAMPTZ NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  open DECIMAL(10,2) NOT NULL,
  high DECIMAL(10,2) NOT NULL,
  low DECIMAL(10,2) NOT NULL,
  close DECIMAL(10,2) NOT NULL,
  volume BIGINT NOT NULL,
  adjusted_close DECIMAL(10,2),

  CONSTRAINT check_price_positive CHECK (
    open > 0 AND high > 0 AND low > 0 AND close > 0
  ),
  CONSTRAINT check_high_low CHECK (high >= low),
  CONSTRAINT check_volume_positive CHECK (volume >= 0)
);

-- Convert to hypertable
SELECT create_hypertable('stock_prices', 'time', if_not_exists => TRUE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol_time ON stock_prices (symbol, time DESC);
CREATE INDEX IF NOT EXISTS idx_stock_prices_time ON stock_prices (time DESC);

-- ============================================
-- Intraday Prices (1-minute bars) - Hypertable
-- ============================================

CREATE TABLE IF NOT EXISTS intraday_prices (
  time TIMESTAMPTZ NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  volume BIGINT NOT NULL,
  bid DECIMAL(10,2),
  ask DECIMAL(10,2),

  CONSTRAINT check_price_positive CHECK (price > 0),
  CONSTRAINT check_volume_positive CHECK (volume >= 0)
);

-- Convert to hypertable with 1-day chunks
SELECT create_hypertable('intraday_prices', 'time',
  chunk_time_interval => INTERVAL '1 day',
  if_not_exists => TRUE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_intraday_symbol_time ON intraday_prices (symbol, time DESC);

-- ============================================
-- Continuous Aggregates for 5-minute bars
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS stock_prices_5min
WITH (timescaledb.continuous) AS
SELECT time_bucket('5 minutes', time) AS bucket,
       symbol,
       FIRST(price, time) AS open,
       MAX(price) AS high,
       MIN(price) AS low,
       LAST(price, time) AS close,
       SUM(volume) AS volume
FROM intraday_prices
GROUP BY bucket, symbol;

-- Create index on continuous aggregate
CREATE INDEX IF NOT EXISTS idx_stock_prices_5min_symbol_time
  ON stock_prices_5min (symbol, bucket DESC);

-- ============================================
-- Portfolio Performance History - Hypertable
-- ============================================

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  time TIMESTAMPTZ NOT NULL,
  portfolio_id UUID NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  cash_balance DECIMAL(15,2) DEFAULT 0.00,
  total_gain DECIMAL(15,2),
  total_gain_percent DECIMAL(7,4),
  day_change DECIMAL(15,2),
  day_change_percent DECIMAL(7,4),
  asset_allocation JSONB,

  CONSTRAINT check_total_value CHECK (total_value >= 0),
  CONSTRAINT check_cash_balance CHECK (cash_balance >= 0)
);

-- Convert to hypertable
SELECT create_hypertable('portfolio_snapshots', 'time', if_not_exists => TRUE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_id_time
  ON portfolio_snapshots (portfolio_id, time DESC);

-- ============================================
-- Market Indices - Hypertable
-- ============================================

CREATE TABLE IF NOT EXISTS market_indices (
  time TIMESTAMPTZ NOT NULL,
  index_symbol VARCHAR(10) NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  change DECIMAL(12,2),
  change_percent DECIMAL(7,4),
  volume BIGINT,

  CONSTRAINT check_index_value CHECK (value > 0)
);

-- Convert to hypertable
SELECT create_hypertable('market_indices', 'time', if_not_exists => TRUE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_market_indices_symbol_time
  ON market_indices (index_symbol, time DESC);

-- ============================================
-- Data Retention & Compression Policies
-- ============================================

-- Compress intraday data older than 7 days
SELECT add_compression_policy('intraday_prices', INTERVAL '7 days', if_not_exists => TRUE);

-- Delete intraday data older than 30 days
SELECT add_retention_policy('intraday_prices', INTERVAL '30 days', if_not_exists => TRUE);

-- Compress portfolio snapshots older than 30 days
SELECT add_compression_policy('portfolio_snapshots', INTERVAL '30 days', if_not_exists => TRUE);

-- Compress stock prices older than 90 days
SELECT add_compression_policy('stock_prices', INTERVAL '90 days', if_not_exists => TRUE);

-- ============================================
-- Refresh Policy for Continuous Aggregates
-- ============================================

SELECT add_continuous_aggregate_policy('stock_prices_5min',
  start_offset => INTERVAL '1 hour',
  end_offset => INTERVAL '1 minute',
  schedule_interval => INTERVAL '5 minutes',
  if_not_exists => TRUE
);

-- ============================================
-- Sample Data (Development Only)
-- ============================================

-- Insert some sample stock prices for testing
INSERT INTO stock_prices (time, symbol, open, high, low, close, volume, adjusted_close)
VALUES
  (NOW() - INTERVAL '1 day', 'AAPL', 175.00, 178.50, 174.20, 178.42, 52847392, 178.42),
  (NOW() - INTERVAL '1 day', 'MSFT', 405.00, 415.00, 404.50, 412.15, 24583019, 412.15),
  (NOW() - INTERVAL '1 day', 'GOOGL', 140.00, 143.50, 139.80, 142.38, 28194738, 142.38),
  (NOW() - INTERVAL '1 day', 'NVDA', 735.00, 770.00, 732.50, 768.62, 41938274, 768.62)
ON CONFLICT DO NOTHING;

-- Insert some intraday prices for testing
INSERT INTO intraday_prices (time, symbol, price, volume, bid, ask)
SELECT
  generate_series(
    NOW() - INTERVAL '1 hour',
    NOW(),
    INTERVAL '1 minute'
  ) AS time,
  'AAPL' AS symbol,
  178.00 + (random() * 2 - 1) AS price,
  floor(random() * 100000 + 50000)::BIGINT AS volume,
  178.00 + (random() * 2 - 1) - 0.05 AS bid,
  178.00 + (random() * 2 - 1) + 0.05 AS ask
ON CONFLICT DO NOTHING;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'TimescaleDB schema initialized successfully';
  RAISE NOTICE 'Hypertables created: stock_prices, intraday_prices, portfolio_snapshots, market_indices';
  RAISE NOTICE 'Continuous aggregates created: stock_prices_5min';
  RAISE NOTICE 'Compression and retention policies applied';
END $$;
